open System
open System.Linq


let longest (s1: string) (s2: string) =
    s1 + s2
    |> Seq.distinct
    |> Seq.sort
    |> Seq.map string
    |> String.concat ""
  // your code


printfn "%A" <| longest "loopingisfunbutdangerous" "lessdangerousthancoding"
