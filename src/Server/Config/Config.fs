module FSharpBB.Server.Config

open Nett
open Nett.Coma
open System.Diagnostics.CodeAnalysis

type TiDB() =
  member val port: int = 0 with get, set
  member val host: string = "" with get, set
  [<TomlIgnore>]
  member x.ConnectString with get () = ""


type ArDB() =
  member val port: int = 0 with get, set
  member val host: string = "" with get, set

type AppConfig() =
  member val TiDB = TiDB() with get, set
  member val ArDB = ArDB() with get, set

let myConfig = TomlSettings.Create(
                  fun cfg ->
                    cfg,())

let config = Toml.CreateAs()
    .MappedToType(() => new AppSettings())
    .StoredAs(store => store
        .File(appSettings).AccessedBySource("app", out appSource).MergeWith(
            store.File(userSettings).AccessedBySource("user", out userSource)))
    .Initialize();
