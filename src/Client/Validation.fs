module Fable.Validation.Core

open System
open System.Text.RegularExpressions

type ValidatorFlags = {
    race: bool
    skip: bool
}
type ValidatorInfo<'T, 'TError> =
    | Input of (ValidatorFlags * 'T)
    | Validator of (ValidatorFlags * 'T* Result<'T, 'TError list>)
    | AsyncValidator of (ValidatorFlags * 'T * Async<Result<'T, 'TError list>>)

type ValidationTester<'T, 'TError> =
    | Test of ('T -> bool)
    | AsyncTest of ('T -> Async<Result<bool, 'TError>>)

let inline internal castAny<'a, 'b> (a: 'a) = (a :> obj) :?> 'b

let getInfoFlagsAndInput info =
    match info with
    | Input (race, input) -> (race, input)
    | Validator (race, input, _) -> (race, input)
    | AsyncValidator (race, input, _) -> (race, input)


let ifInvalid<'T, 'TError> (test: ValidationTester<'T, 'TError>) (error: 'TError) (info: ValidatorInfo<'T, 'TError>): ValidatorInfo<'T, 'TError> =
    let (flags, input) =  getInfoFlagsAndInput info
    let {race = race; skip = skip} = flags
    if skip then printfn "skip:%A" info; info
    else
        let inline mkResult input errors =
            if List.isEmpty errors then Ok input
            else Error errors
        let inline mkResultWithLast lastResult input errors =
            match lastResult with
            | Ok input -> mkResult input errors
            | Error errors' -> mkResult input (errors @ errors')


        let inline asyncValidate () =
            async {
                let mutable testErrors = []
                match test with
                | Test test ->
                    if test input |> not then testErrors <- error::testErrors
                | AsyncTest test ->
                    let! result' = test input
                    match result' with
                    | Ok false -> testErrors <- error::testErrors
                    | Error error' -> testErrors <- error'::testErrors
                    | Ok true -> ()

                if race && List.isEmpty testErrors |> not then
                    return mkResult input testErrors
                else
                    let mutable result = Ok input
                    match info with
                    | Input (race, input') ->
                        failwith "this should never happen for asyncValidator "
                    | Validator (race, input, result') ->
                        result <- mkResultWithLast result' input testErrors
                    | AsyncValidator (race, input, result') ->
                        let! asyncInfoResult = result'
                        result <- mkResultWithLast asyncInfoResult input testErrors
                    return result
            }

        match test, info with
        | AsyncTest _, _ | _, AsyncValidator _ ->
            AsyncValidator (flags, input, asyncValidate ())
        | Test test', Input (_, input') ->
            let testErrors = if test' input' |> not then [error] else []
            Validator (flags, input', (mkResult input' testErrors))
        | Test test', Validator (_, input', result') ->
            let testErrors = if test' input' |> not then [error] else []
            let result =
                if race && List.isEmpty testErrors |> not then mkResult input' testErrors
                else mkResultWithLast result' input' testErrors
            Validator (flags, input', result)

let inline ifInvalidSync<'T, 'TError> (test: 'T -> bool) =
    ifInvalid<'T, 'TError> (Test test)


let inline ifInvalidAsync<'T, 'TError> (test: 'T -> Async<Result<bool, 'TError>>) =
    ifInvalid<'T, 'TError> (AsyncTest test)

let internal baseValidateAsync<'T, 'TError, 'L when 'L : comparison>
    raceField
    (rules: 'T -> ('L * ValidatorInfo<obj, 'TError>) list)
    input =
        async {
            let mutable msgMap = Map<'L, 'TError list> Seq.empty
            let consumeResult key result =
                match result with
                | Ok _ -> ()
                | Error errors ->
                    msgMap <- Map.add key errors msgMap
            let mutable tail = rules input
            let mutable isBreak = false
            while not isBreak && List.isEmpty tail |> not do
                let (key, info) = tail.Head
                tail <- tail.Tail
                match info with
                | Validator (_, _, result) ->
                    result |> consumeResult key
                | AsyncValidator (_, _, result) ->
                    let! result = result
                    consumeResult key result
                | Input input' -> failwithf "Validation rules must be a function, but found input: %A" input'
                if raceField && Map.isEmpty msgMap |> not then
                    isBreak <- true

            return
                if Map.isEmpty msgMap then Ok input
                else Error msgMap
        }

let inline allAsync<'T, 'TError, 'L when 'L : comparison> = baseValidateAsync<'T, 'TError, 'L> false
let inline raceAsync<'T, 'TError, 'L when 'L : comparison> = baseValidateAsync<'T, 'TError, 'L> true

let internal baseValidateSync<'T, 'TError, 'L when 'L : comparison>
    raceField
    (rules: 'T -> ('L * ValidatorInfo<obj, 'TError>) list)
    input =
            let mutable msgMap = Map<'L, 'TError list> Seq.empty
            let consumeResult key result =
                match result with
                | Ok _ -> ()
                | Error errors ->
                    (msgMap <- Map.add key errors msgMap)
            let mutable tail = rules input
            let mutable isBreak = false
            while not isBreak && List.isEmpty tail |> not do
                let (key, info) = tail.Head
                tail <- tail.Tail
                match info with
                | Validator (_, _, result) ->
                    result |> consumeResult key
                | AsyncValidator (_, input', vali) ->
                    failwithf "Sync validation cannot contain async rules: %A, whole input: %A" (input', vali) input
                | Input input' -> failwithf "Validation rules must be a function, but found input: %A, whole input: %A" input' input
                if raceField && Map.isEmpty msgMap |> not then
                    isBreak <- true

            if Map.isEmpty msgMap then Ok input
            else Error msgMap

let inline all<'T, 'TError, 'L when 'L : comparison> = baseValidateSync<'T, 'TError, 'L> false
let inline race<'T, 'TError, 'L when 'L : comparison> = baseValidateSync<'T, 'TError, 'L> true

let inline allSync<'T, 'TError, 'L when 'L : comparison> = all
let inline raceSync<'T, 'TError, 'L when 'L : comparison> = race

let inline test input = Input ({race=true;skip=false}, input)
let inline testAll input = Input ({race=false;skip=false}, input)

let inline endTest<'T, 'TError> = castAny<ValidatorInfo<'T, 'TError>, ValidatorInfo<obj, 'TError>>


let skipNone<'T, 'TError> (info: ValidatorInfo<'T option, 'TError>): ValidatorInfo<'T, 'TError> =
    let (flags, input) = getInfoFlagsAndInput info
    let {race=race;skip=skip} = flags
    let dummy = castAny<obj, 'T> null
    match input with
    | Some i -> Validator (flags, i, Ok(i))
    | None -> Validator ({flags with skip = true}, dummy, Ok(dummy))


let skipError<'T, 'TError, 'Error> (info: ValidatorInfo<Result<'T, 'TError>, 'Error>) : ValidatorInfo<'T, 'Error> =
    let (flags, input) = getInfoFlagsAndInput info
    let {race=race;skip=skip} = flags
    let dummy = castAny<obj, 'T> null
    match input with
    | Ok i -> Validator (flags, i, Ok(i))
    | Error _ -> Validator ({flags with skip = true}, dummy, Ok(dummy))


let ifNone<'T, 'TError> error info =
    let _ifNone = Option.isSome |> Test |> ifInvalid<'T option, 'TError>
    _ifNone error info |> skipNone<'T, 'TError>

let ifError<'T, 'TError, 'Error> error info =
    let inline isOk (input: Result<'T, 'TError>) =
        match input with
        | Ok _ -> true
        | Error _ -> false
    let _ifError = isOk |> Test |> ifInvalid<Result<'T, 'TError>, 'Error>
    _ifError error info |> skipError<'T, 'TError, 'Error>


let ifBlank<'TError> =
    String.IsNullOrWhiteSpace >> not |> Test |> ifInvalid<string, 'TError>

let ifNotGt min =
    (fun input -> input > min) |> Test |> ifInvalid

let ifNotMaxLen len =
    (fun input -> Seq.length input <= len) |> Test |> ifInvalid

let ifNotMinLen len =
    (fun input -> Seq.length input >= len) |> Test |> ifInvalid

let internal mailRe = Regex (@"^(([^<>()\[\]\\.,;:\s@""]+(\.[^<>()\[\]\\.,;:\s@""]+)*)|("".+""))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$", RegexOptions.Compiled ||| RegexOptions.ECMAScript)

let ifInvalidMail<'TError> = mailRe.IsMatch |> Test |> ifInvalid<string, 'TError>

let internal urlRe = Regex (@"^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)$", RegexOptions.Compiled ||| RegexOptions.ECMAScript)

let ifInvalidUrl<'TError> = urlRe.IsMatch |> Test |> ifInvalid<string, 'TError>


// ===== test
open FSharp.Reflection

type Au =
    | A of string
    | B of int

open Fable.Core
open Fable.Core.JsInterop
open Fable.Import


[<Emit("delete $0[$1]")>]
let delete<'T> obj key = jsNative

type People = {
  Name: string
  Age: int
} with
  member x.toJSON () =
    let copyed = JS.Object.assign (createObj [], jsThis)
    copyed?name <- copyed?Name
    delete copyed "Name"
    copyed
  static member ofJSON (json) =
    let copyed = JS.Object.assign (createObj [], jsThis)
    copyed?Name <- copyed?name
    delete copyed "name"
    let newPeople = Unchecked.defaultof<People>
    JS.Object.assign (newPeople, copyed)


type People2 = {
    name: string
    age: int
}
JS.console.time "sync"
let internal result =
    all (fun t ->
        [
            ("age", testAll t.age |> ifNotGt 18 "Age should greater then 18" |> endTest)
            ("name", testAll t.name |> ifBlank "Name shouldn't be empty" |> ifInvalidMail "Not valid mail sync" |> ifNotMinLen 12 "Name's minimal length is 12" |> endTest)
        ]) {name = ""; age = 15}
JS.console.timeEnd "sync"

printfn "all sync result: %A" result
printfn "mail: %A" (ifInvalidMail "Not valid mail" (Input ({race= false; skip= false}, "")))
let asyncResult =
    let rules t =
        [("age", testAll t.age |> ifNotGt 18 "Age should greater then 18" |> endTest);
        ("name", testAll t.name |> ifBlank "Name shouldn't be empty" |> ifInvalidMail "Not valid mail" |> ifNotMinLen 12 "Name's minimal length is 12" |> endTest)]
    async {
        JS.console.time "async"
        let! result' = allAsync rules {name = ""; age = 15}
        JS.console.timeEnd "async"
        printfn "all async result: %A" result'
    }
    |> Async.StartImmediate

let p = {name = ""; age = 15}
JS.console.time "raw"
let r' = String.IsNullOrWhiteSpace(p.name) || (Seq.length p.name) > 12
let r1' = p.age > 18
JS.console.timeEnd "raw"
// let asyncTest =
//     async {
//       return 1
//     } |> Async.RunSynchronously
// printfn "%A" asyncTest
// printfn "async result: %A" asyncResult
