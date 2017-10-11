import { setType } from "../fable-core/Symbol";
import _Symbol from "../fable-core/Symbol";
import { equals, Any, Unit, Interface, Function as _Function } from "../fable-core/Util";
import { createElement as createElement_1 } from "react";
import { fold } from "../fable-core/Seq";
export const Props = function (__exports) {
  const Prop = __exports.Prop = class Prop {
    constructor(tag, data) {
      this.tag = tag;
      this.data = data;
    }

    [_Symbol.reflection]() {
      return {
        type: "Fable.Helpers.React.Props.Prop",
        interfaces: ["FSharpUnion", "Fable.Helpers.React.Props.IHTMLProp"],
        cases: [["Key", "string"], ["Ref", _Function([Interface("Fable.Import.Browser.Element"), Unit])]]
      };
    }

  };
  setType("Fable.Helpers.React.Props.Prop", Prop);
  const DOMAttr = __exports.DOMAttr = class DOMAttr {
    constructor(tag, data) {
      this.tag = tag;
      this.data = data;
    }

    [_Symbol.reflection]() {
      return {
        type: "Fable.Helpers.React.Props.DOMAttr",
        interfaces: ["FSharpUnion", "Fable.Helpers.React.Props.IHTMLProp"],
        cases: [["DangerouslySetInnerHTML", Any], ["OnCut", _Function([Interface("Fable.Import.React.ClipboardEvent"), Unit])], ["OnPaste", _Function([Interface("Fable.Import.React.ClipboardEvent"), Unit])], ["OnCompositionEnd", _Function([Interface("Fable.Import.React.CompositionEvent"), Unit])], ["OnCompositionStart", _Function([Interface("Fable.Import.React.CompositionEvent"), Unit])], ["OnCopy", _Function([Interface("Fable.Import.React.ClipboardEvent"), Unit])], ["OnCompositionUpdate", _Function([Interface("Fable.Import.React.CompositionEvent"), Unit])], ["OnFocus", _Function([Interface("Fable.Import.React.FocusEvent"), Unit])], ["OnBlur", _Function([Interface("Fable.Import.React.FocusEvent"), Unit])], ["OnChange", _Function([Interface("Fable.Import.React.FormEvent"), Unit])], ["OnInput", _Function([Interface("Fable.Import.React.FormEvent"), Unit])], ["OnSubmit", _Function([Interface("Fable.Import.React.FormEvent"), Unit])], ["OnLoad", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnError", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnKeyDown", _Function([Interface("Fable.Import.React.KeyboardEvent"), Unit])], ["OnKeyPress", _Function([Interface("Fable.Import.React.KeyboardEvent"), Unit])], ["OnKeyUp", _Function([Interface("Fable.Import.React.KeyboardEvent"), Unit])], ["OnAbort", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnCanPlay", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnCanPlayThrough", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnDurationChange", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnEmptied", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnEncrypted", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnEnded", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnLoadedData", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnLoadedMetadata", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnLoadStart", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnPause", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnPlay", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnPlaying", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnProgress", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnRateChange", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnSeeked", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnSeeking", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnStalled", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnSuspend", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnTimeUpdate", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnVolumeChange", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnWaiting", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnClick", _Function([Interface("Fable.Import.React.MouseEvent"), Unit])], ["OnContextMenu", _Function([Interface("Fable.Import.React.MouseEvent"), Unit])], ["OnDoubleClick", _Function([Interface("Fable.Import.React.MouseEvent"), Unit])], ["OnDrag", _Function([Interface("Fable.Import.React.DragEvent"), Unit])], ["OnDragEnd", _Function([Interface("Fable.Import.React.DragEvent"), Unit])], ["OnDragEnter", _Function([Interface("Fable.Import.React.DragEvent"), Unit])], ["OnDragExit", _Function([Interface("Fable.Import.React.DragEvent"), Unit])], ["OnDragLeave", _Function([Interface("Fable.Import.React.DragEvent"), Unit])], ["OnDragOver", _Function([Interface("Fable.Import.React.DragEvent"), Unit])], ["OnDragStart", _Function([Interface("Fable.Import.React.DragEvent"), Unit])], ["OnDrop", _Function([Interface("Fable.Import.React.DragEvent"), Unit])], ["OnMouseDown", _Function([Interface("Fable.Import.React.MouseEvent"), Unit])], ["OnMouseEnter", _Function([Interface("Fable.Import.React.MouseEvent"), Unit])], ["OnMouseLeave", _Function([Interface("Fable.Import.React.MouseEvent"), Unit])], ["OnMouseMove", _Function([Interface("Fable.Import.React.MouseEvent"), Unit])], ["OnMouseOut", _Function([Interface("Fable.Import.React.MouseEvent"), Unit])], ["OnMouseOver", _Function([Interface("Fable.Import.React.MouseEvent"), Unit])], ["OnMouseUp", _Function([Interface("Fable.Import.React.MouseEvent"), Unit])], ["OnSelect", _Function([Interface("Fable.Import.React.SyntheticEvent"), Unit])], ["OnTouchCancel", _Function([Interface("Fable.Import.React.TouchEvent"), Unit])], ["OnTouchEnd", _Function([Interface("Fable.Import.React.TouchEvent"), Unit])], ["OnTouchMove", _Function([Interface("Fable.Import.React.TouchEvent"), Unit])], ["OnTouchStart", _Function([Interface("Fable.Import.React.TouchEvent"), Unit])], ["OnScroll", _Function([Interface("Fable.Import.React.UIEvent"), Unit])], ["OnWheel", _Function([Interface("Fable.Import.React.WheelEvent"), Unit])], ["OnAnimationStart", _Function([Interface("Fable.Import.React.AnimationEvent"), Unit])], ["OnAnimationEnd", _Function([Interface("Fable.Import.React.AnimationEvent"), Unit])], ["OnAnimationIteration", _Function([Interface("Fable.Import.React.AnimationEvent"), Unit])], ["OnTransitionEnd", _Function([Interface("Fable.Import.React.TransitionEvent"), Unit])]]
      };
    }

  };
  setType("Fable.Helpers.React.Props.DOMAttr", DOMAttr);
  const HTMLAttr = __exports.HTMLAttr = class HTMLAttr {
    constructor(tag, data) {
      this.tag = tag;
      this.data = data;
    }

    [_Symbol.reflection]() {
      return {
        type: "Fable.Helpers.React.Props.HTMLAttr",
        interfaces: ["FSharpUnion", "System.IEquatable", "Fable.Helpers.React.Props.IHTMLProp"],
        cases: [["DefaultChecked", "boolean"], ["DefaultValue", "string"], ["Accept", "string"], ["AcceptCharset", "string"], ["AccessKey", "string"], ["Action", "string"], ["AllowFullScreen", "boolean"], ["AllowTransparency", "boolean"], ["Alt", "string"], ["aria-haspopup", "boolean"], ["aria-expanded", "boolean"], ["Async", "boolean"], ["AutoComplete", "string"], ["AutoFocus", "boolean"], ["AutoPlay", "boolean"], ["Capture", "boolean"], ["CellPadding", Any], ["CellSpacing", Any], ["CharSet", "string"], ["Challenge", "string"], ["Checked", "boolean"], ["ClassID", "string"], ["ClassName", "string"], ["Cols", "number"], ["ColSpan", "number"], ["Content", "string"], ["ContentEditable", "boolean"], ["ContextMenu", "string"], ["Controls", "boolean"], ["Coords", "string"], ["CrossOrigin", "string"], ["data-toggle", "string"], ["DateTime", "string"], ["Default", "boolean"], ["Defer", "boolean"], ["Dir", "string"], ["Disabled", "boolean"], ["Download", Any], ["Draggable", "boolean"], ["EncType", "string"], ["Form", "string"], ["FormAction", "string"], ["FormEncType", "string"], ["FormMethod", "string"], ["FormNoValidate", "boolean"], ["FormTarget", "string"], ["FrameBorder", Any], ["Headers", "string"], ["Height", Any], ["Hidden", "boolean"], ["High", "number"], ["Href", "string"], ["HrefLang", "string"], ["HtmlFor", "string"], ["HttpEquiv", "string"], ["Icon", "string"], ["Id", "string"], ["InputMode", "string"], ["Integrity", "string"], ["Is", "string"], ["KeyParams", "string"], ["KeyType", "string"], ["Kind", "string"], ["Label", "string"], ["Lang", "string"], ["List", "string"], ["Loop", "boolean"], ["Low", "number"], ["Manifest", "string"], ["MarginHeight", "number"], ["MarginWidth", "number"], ["Max", Any], ["MaxLength", "number"], ["Media", "string"], ["MediaGroup", "string"], ["Method", "string"], ["Min", Any], ["MinLength", "number"], ["Multiple", "boolean"], ["Muted", "boolean"], ["Name", "string"], ["NoValidate", "boolean"], ["Open", "boolean"], ["Optimum", "number"], ["Pattern", "string"], ["Placeholder", "string"], ["Poster", "string"], ["Preload", "string"], ["RadioGroup", "string"], ["ReadOnly", "boolean"], ["Rel", "string"], ["Required", "boolean"], ["Role", "string"], ["Rows", "number"], ["RowSpan", "number"], ["Sandbox", "string"], ["Scope", "string"], ["Scoped", "boolean"], ["Scrolling", "string"], ["Seamless", "boolean"], ["Selected", "boolean"], ["Shape", "string"], ["Size", "number"], ["Sizes", "string"], ["Span", "number"], ["SpellCheck", "boolean"], ["Src", "string"], ["SrcDoc", "string"], ["SrcLang", "string"], ["SrcSet", "string"], ["Start", "number"], ["Step", Any], ["Summary", "string"], ["TabIndex", "number"], ["Target", "string"], ["Title", "string"], ["Type", "string"], ["UseMap", "string"], ["Value", "string"], ["Width", Any], ["Wmode", "string"], ["Wrap", "string"], ["About", "string"], ["Datatype", "string"], ["Inlist", Any], ["Prefix", "string"], ["Property", "string"], ["Resource", "string"], ["Typeof", "string"], ["Vocab", "string"], ["AutoCapitalize", "string"], ["AutoCorrect", "string"], ["AutoSave", "string"], ["ItemProp", "string"], ["ItemScope", "boolean"], ["ItemType", "string"], ["ItemID", "string"], ["ItemRef", "string"], ["Results", "number"], ["Security", "string"], ["Unselectable", "boolean"]]
      };
    }

    Equals(other) {
      return this === other || this.tag === other.tag && equals(this.data, other.data);
    }

  };
  setType("Fable.Helpers.React.Props.HTMLAttr", HTMLAttr);
  const SVGAttr = __exports.SVGAttr = class SVGAttr {
    constructor(tag, data) {
      this.tag = tag;
      this.data = data;
    }

    [_Symbol.reflection]() {
      return {
        type: "Fable.Helpers.React.Props.SVGAttr",
        interfaces: ["FSharpUnion", "System.IEquatable", "Fable.Helpers.React.Props.IProp"],
        cases: [["ClipPath", "string"], ["Cx", Any], ["Cy", Any], ["D", "string"], ["Dx", Any], ["Dy", Any], ["Fill", "string"], ["FillOpacity", Any], ["FontFamily", "string"], ["FontSize", Any], ["Fx", Any], ["Fy", Any], ["GradientTransform", "string"], ["GradientUnits", "string"], ["MarkerEnd", "string"], ["MarkerMid", "string"], ["MarkerStart", "string"], ["Offset", Any], ["Opacity", Any], ["PatternContentUnits", "string"], ["PatternUnits", "string"], ["Points", "string"], ["PreserveAspectRatio", "string"], ["R", Any], ["Rx", Any], ["Ry", Any], ["SpreadMethod", "string"], ["StopColor", "string"], ["StopOpacity", Any], ["Stroke", "string"], ["StrokeDasharray", "string"], ["StrokeLinecap", "string"], ["StrokeMiterlimit", "string"], ["StrokeOpacity", Any], ["StrokeWidth", Any], ["TextAnchor", "string"], ["Transform", "string"], ["Version", "string"], ["ViewBox", "string"], ["Width", Any], ["X1", Any], ["X2", Any], ["X", Any], ["XlinkActuate", "string"], ["XlinkArcrole", "string"], ["XlinkHref", "string"], ["XlinkRole", "string"], ["XlinkShow", "string"], ["XlinkTitle", "string"], ["XlinkType", "string"], ["XmlBase", "string"], ["XmlLang", "string"], ["XmlSpace", "string"], ["Y1", Any], ["Y2", Any], ["Y", Any]]
      };
    }

    Equals(other) {
      return this === other || this.tag === other.tag && equals(this.data, other.data);
    }

  };
  setType("Fable.Helpers.React.Props.SVGAttr", SVGAttr);
  const CSSProp = __exports.CSSProp = class CSSProp {
    constructor(tag, data) {
      this.tag = tag;
      this.data = data;
    }

    [_Symbol.reflection]() {
      return {
        type: "Fable.Helpers.React.Props.CSSProp",
        interfaces: ["FSharpUnion", "System.IEquatable", "Fable.Helpers.React.Props.ICSSProp"],
        cases: [["BoxFlex", "number"], ["BoxFlexGroup", "number"], ["ColumnCount", "number"], ["Cursor", "string"], ["Flex", Any], ["FlexGrow", "number"], ["FlexShrink", "number"], ["FontWeight", Any], ["LineClamp", "number"], ["LineHeight", Any], ["Opacity", "number"], ["Order", "number"], ["Orphans", "number"], ["Widows", "number"], ["ZIndex", "number"], ["Zoom", "number"], ["FontSize", Any], ["FillOpacity", "number"], ["StrokeOpacity", "number"], ["StrokeWidth", "number"], ["AlignContent", Any], ["AlignItems", Any], ["AlignSelf", Any], ["AlignmentAdjust", Any], ["AlignmentBaseline", Any], ["AnimationDelay", Any], ["AnimationDirection", Any], ["AnimationIterationCount", Any], ["AnimationName", Any], ["AnimationPlayState", Any], ["Appearance", Any], ["BackfaceVisibility", Any], ["BackgroundBlendMode", Any], ["BackgroundColor", Any], ["BackgroundComposite", Any], ["BackgroundImage", Any], ["BackgroundOrigin", Any], ["BackgroundPositionX", Any], ["BackgroundRepeat", Any], ["BaselineShift", Any], ["Behavior", Any], ["Border", Any], ["BorderBottomLeftRadius", Any], ["BorderBottomRightRadius", Any], ["BorderBottomWidth", Any], ["BorderCollapse", Any], ["BorderColor", Any], ["BorderCornerShape", Any], ["BorderImageSource", Any], ["BorderImageWidth", Any], ["BorderLeft", Any], ["BorderLeftColor", Any], ["BorderLeftStyle", Any], ["BorderLeftWidth", Any], ["BorderRadius", Any], ["BorderRight", Any], ["BorderRightColor", Any], ["BorderRightStyle", Any], ["BorderRightWidth", Any], ["BorderSpacing", Any], ["BorderStyle", Any], ["BorderTop", Any], ["BorderTopColor", Any], ["BorderTopLeftRadius", Any], ["BorderTopRightRadius", Any], ["BorderTopStyle", Any], ["BorderTopWidth", Any], ["BorderWidth", Any], ["Bottom", Any], ["BoxAlign", Any], ["BoxDecorationBreak", Any], ["BoxDirection", Any], ["BoxLineProgression", Any], ["BoxLines", Any], ["BoxOrdinalGroup", Any], ["BreakAfter", Any], ["BreakBefore", Any], ["BreakInside", Any], ["Clear", Any], ["Clip", Any], ["ClipRule", Any], ["Color", Any], ["ColumnFill", Any], ["ColumnGap", Any], ["ColumnRule", Any], ["ColumnRuleColor", Any], ["ColumnRuleWidth", Any], ["ColumnSpan", Any], ["ColumnWidth", Any], ["Columns", Any], ["CounterIncrement", Any], ["CounterReset", Any], ["Cue", Any], ["CueAfter", Any], ["Direction", Any], ["Display", Any], ["Fill", Any], ["FillRule", Any], ["Filter", Any], ["FlexAlign", Any], ["FlexBasis", Any], ["FlexDirection", Any], ["FlexFlow", Any], ["FlexItemAlign", Any], ["FlexLinePack", Any], ["FlexOrder", Any], ["FlexWrap", Any], ["Float", Any], ["FlowFrom", Any], ["Font", Any], ["FontFamily", Any], ["FontKerning", Any], ["FontSizeAdjust", Any], ["FontStretch", Any], ["FontStyle", Any], ["FontSynthesis", Any], ["FontVariant", Any], ["FontVariantAlternates", Any], ["GridArea", Any], ["GridColumn", Any], ["GridColumnEnd", Any], ["GridColumnStart", Any], ["GridRow", Any], ["GridRowEnd", Any], ["GridRowPosition", Any], ["GridRowSpan", Any], ["GridTemplateAreas", Any], ["GridTemplateColumns", Any], ["GridTemplateRows", Any], ["Height", Any], ["HyphenateLimitChars", Any], ["HyphenateLimitLines", Any], ["HyphenateLimitZone", Any], ["Hyphens", Any], ["ImeMode", Any], ["JustifyContent", Any], ["LayoutGrid", Any], ["LayoutGridChar", Any], ["LayoutGridLine", Any], ["LayoutGridMode", Any], ["LayoutGridType", Any], ["Left", Any], ["LetterSpacing", Any], ["LineBreak", Any], ["ListStyle", Any], ["ListStyleImage", Any], ["ListStylePosition", Any], ["ListStyleType", Any], ["Margin", Any], ["MarginBottom", Any], ["MarginLeft", Any], ["MarginRight", Any], ["MarginTop", Any], ["MarqueeDirection", Any], ["MarqueeStyle", Any], ["Mask", Any], ["MaskBorder", Any], ["MaskBorderRepeat", Any], ["MaskBorderSlice", Any], ["MaskBorderSource", Any], ["MaskBorderWidth", Any], ["MaskClip", Any], ["MaskOrigin", Any], ["MaxFontSize", Any], ["MaxHeight", Any], ["MaxWidth", Any], ["MinHeight", Any], ["MinWidth", Any], ["Outline", Any], ["OutlineColor", Any], ["OutlineOffset", Any], ["Overflow", Any], ["OverflowStyle", Any], ["OverflowX", Any], ["OverflowY", Any], ["Padding", Any], ["PaddingBottom", Any], ["PaddingLeft", Any], ["PaddingRight", Any], ["PaddingTop", Any], ["PageBreakAfter", Any], ["PageBreakBefore", Any], ["PageBreakInside", Any], ["Pause", Any], ["PauseAfter", Any], ["PauseBefore", Any], ["Perspective", Any], ["PerspectiveOrigin", Any], ["PointerEvents", Any], ["Position", Any], ["PunctuationTrim", Any], ["Quotes", Any], ["RegionFragment", Any], ["RestAfter", Any], ["RestBefore", Any], ["Right", Any], ["RubyAlign", Any], ["RubyPosition", Any], ["ShapeImageThreshold", Any], ["ShapeInside", Any], ["ShapeMargin", Any], ["ShapeOutside", Any], ["Speak", Any], ["SpeakAs", Any], ["TabSize", Any], ["TableLayout", Any], ["TextAlign", Any], ["TextAlignLast", Any], ["TextDecoration", Any], ["TextDecorationColor", Any], ["TextDecorationLine", Any], ["TextDecorationLineThrough", Any], ["TextDecorationNone", Any], ["TextDecorationOverline", Any], ["TextDecorationSkip", Any], ["TextDecorationStyle", Any], ["TextDecorationUnderline", Any], ["TextEmphasis", Any], ["TextEmphasisColor", Any], ["TextEmphasisStyle", Any], ["TextHeight", Any], ["TextIndent", Any], ["TextJustifyTrim", Any], ["TextKashidaSpace", Any], ["TextLineThrough", Any], ["TextLineThroughColor", Any], ["TextLineThroughMode", Any], ["TextLineThroughStyle", Any], ["TextLineThroughWidth", Any], ["TextOverflow", Any], ["TextOverline", Any], ["TextOverlineColor", Any], ["TextOverlineMode", Any], ["TextOverlineStyle", Any], ["TextOverlineWidth", Any], ["TextRendering", Any], ["TextScript", Any], ["TextShadow", Any], ["TextTransform", Any], ["TextUnderlinePosition", Any], ["TextUnderlineStyle", Any], ["Top", Any], ["TouchAction", Any], ["Transform", Any], ["TransformOrigin", Any], ["TransformOriginZ", Any], ["TransformStyle", Any], ["Transition", Any], ["TransitionDelay", Any], ["TransitionDuration", Any], ["TransitionProperty", Any], ["TransitionTimingFunction", Any], ["UnicodeBidi", Any], ["UnicodeRange", Any], ["UserFocus", Any], ["UserInput", Any], ["VerticalAlign", Any], ["Visibility", Any], ["VoiceBalance", Any], ["VoiceDuration", Any], ["VoiceFamily", Any], ["VoicePitch", Any], ["VoiceRange", Any], ["VoiceRate", Any], ["VoiceStress", Any], ["VoiceVolume", Any], ["WhiteSpace", Any], ["WhiteSpaceTreatment", Any], ["Width", Any], ["WordBreak", Any], ["WordSpacing", Any], ["WordWrap", Any], ["WrapFlow", Any], ["WrapMargin", Any], ["WrapOption", Any], ["WritingMode", Any]]
      };
    }

    Equals(other) {
      return this === other || this.tag === other.tag && equals(this.data, other.data);
    }

  };
  setType("Fable.Helpers.React.Props.CSSProp", CSSProp);
  return __exports;
}({});
export const createElement = createElement_1;
export function classBaseList(std, classes) {
  return new Props.HTMLAttr(22, (() => {
    const folder = function (complete, _arg1) {
      if (_arg1[1]) {
        return complete + " " + _arg1[0];
      } else {
        return complete;
      }
    };

    return function (list) {
      return fold(folder, std, list);
    };
  })()(classes));
}
export function classList(classes) {
  return classBaseList("", classes);
}