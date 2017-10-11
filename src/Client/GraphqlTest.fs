module Client.GraphQLTest

open FSharp.Data.GraphQL
open System.Collections.Generic
open Fable.Core
open Fable.Core.JsInterop

importAll<unit> "isomorphic-fetch"

type MyClient = GraphQLProvider<"http://localhost:8053/">
printfn "%A" MyClient.Query
let fetch () =
    printfn "run fetch"
    async {
        printfn "before fetch"
        let! hero = MyClient.Queries.Hero("1000", fun c ->
                    Fields(
                        c.name,
                        Selection(c.friends, fun f -> Fields(f.name)),
                        MyClient.Types.Human.On(fun h -> Fields(h.appearsIn))
                    ))
        match hero with
        | None -> ()
        | Some hero ->
            printfn "My hero is %A" hero.name
            printfn "Appears in %O: %b" MyClient.Types.Episode.Empire
                (hero.appearsIn |> Array.exists ((=) MyClient.Types.Episode.Empire))
            printfn "My hero's friends are:"
            hero.friends
            |> Array.choose (fun x -> x.name)
            |> Array.iter (printfn "- %s")
        printfn "after fetch"
    }
    |> Async.StartImmediate


let freeQuery = "{ hero(id: \"1000\"){ id, name, appearsIn, friends { name } } }"
let a = MyClient.Query(freeQuery)

printfn "%A" a
let (?) (o: obj) (k: string) =
    match o with
    | :? IDictionary<string,obj> as dic -> dic.[k]
    | _ -> null

let hero2 () =
    async {
        printfn "before hero2"
        let! data = MyClient.Query(freeQuery) |> Async.Catch
        data |> function
            | Choice1Of2 data ->
                printfn "Hero's name: %A" data?hero?name
            | Choice2Of2 err ->
                printfn "ERROR: %s" err.Message
        printfn "after hero2"
    }

let hero3 =
    async {
        printfn "before hero2"
        let! data = MyClient.Query(freeQuery) |> Async.Catch
        data |> function
            | Choice1Of2 data ->
                printfn "Hero's name: %A" data?hero?name
            | Choice2Of2 err ->
                printfn "ERROR: %s" err.Message
        printfn "after hero2"
    }

let mutable result = 0
async {
    while result < 10 do
        result <- result + 1
} |> Async.StartImmediate


printfn "result: %d" result

fetch()
hero2() |> Async.StartImmediate
