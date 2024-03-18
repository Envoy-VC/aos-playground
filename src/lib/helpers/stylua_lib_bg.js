import * as wasm from './stylua_lib_bg.wasm';

const lTextDecoder =
  typeof TextDecoder === 'undefined'
    ? (0, module.require)('util').TextDecoder
    : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachedUint8Memory0;
function getUint8Memory0() {
  if (cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

let cachedInt32Memory0;
function getInt32Memory0() {
  if (cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

function _assertClass(instance, klass) {
  if (!(instance instanceof klass)) {
    throw new Error(`expected instance of ${klass.name}`);
  }
  return instance.ptr;
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder =
  typeof TextEncoder === 'undefined'
    ? (0, module.require)('util').TextEncoder
    : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString =
  typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3));
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function getObject(idx) {
  return heap[idx];
}

function dropObject(idx) {
  if (idx < 36) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
/**
 * @param {string} code
 * @param {Config} config
 * @param {Range | undefined} range
 * @param {number} verify_output
 * @returns {string}
 */
export function formatCode(code, config, range, verify_output) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(
      code,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    _assertClass(config, Config);
    var ptr1 = config.ptr;
    config.ptr = 0;
    let ptr2 = 0;
    if (!isLikeNone(range)) {
      _assertClass(range, Range);
      ptr2 = range.ptr;
      range.ptr = 0;
    }
    wasm.formatCode(retptr, ptr0, len0, ptr1, ptr2, verify_output);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    var ptr3 = r0;
    var len3 = r1;
    if (r3) {
      ptr3 = 0;
      len3 = 0;
      throw takeObject(r2);
    }
    return getStringFromWasm0(ptr3, len3);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(ptr3, len3);
  }
}

/**
 * The type of indents to use when indenting
 */
export const IndentType = Object.freeze({
  /**
   * Indent using tabs (`\t`)
   */
  Tabs: 0,
  0: 'Tabs',
  /**
   * Indent using spaces (` `)
   */
  Spaces: 1,
  1: 'Spaces',
});
/**
 * The type of line endings to use at the end of a line
 */
export const LineEndings = Object.freeze({
  /**
   * Unix Line Endings (LF) - `\n`
   */
  Unix: 0,
  0: 'Unix',
  /**
   * Windows Line Endings (CRLF) - `\r\n`
   */
  Windows: 1,
  1: 'Windows',
});
/**
 * The style of quotes to use within string literals
 */
export const QuoteStyle = Object.freeze({
  /**
   * Use double quotes where possible, but change to single quotes if it produces less escapes
   */
  AutoPreferDouble: 0,
  0: 'AutoPreferDouble',
  /**
   * Use single quotes where possible, but change to double quotes if it produces less escapes
   */
  AutoPreferSingle: 1,
  1: 'AutoPreferSingle',
  /**
   * Always use double quotes in all strings
   */
  ForceDouble: 2,
  2: 'ForceDouble',
  /**
   * Always use single quotes in all strings
   */
  ForceSingle: 3,
  3: 'ForceSingle',
});
/**
 * When to use call parentheses
 */
export const CallParenType = Object.freeze({
  /**
   * Use call parentheses all the time
   */
  Always: 0,
  0: 'Always',
  /**
   * Skip call parentheses when only a string argument is used.
   */
  NoSingleString: 1,
  1: 'NoSingleString',
  /**
   * Skip call parentheses when only a table argument is used.
   */
  NoSingleTable: 2,
  2: 'NoSingleTable',
  /**
   * Skip call parentheses when only a table or string argument is used.
   */
  None: 3,
  3: 'None',
  /**
   * Keep call parentheses based on its presence in input code.
   */
  Input: 4,
  4: 'Input',
});
/**
 * What mode to use if we want to collapse simple functions / guard statements
 */
export const CollapseSimpleStatement = Object.freeze({
  /**
   * Never collapse
   */
  Never: 0,
  0: 'Never',
  /**
   * Collapse simple functions onto a single line
   */
  FunctionOnly: 1,
  1: 'FunctionOnly',
  /**
   * Collapse simple if guards onto a single line
   */
  ConditionalOnly: 2,
  2: 'ConditionalOnly',
  /**
   * Collapse all simple statements onto a single line
   */
  Always: 3,
  3: 'Always',
});
/**
 * The type of verification to perform to validate that the output AST is still correct.
 */
export const OutputVerification = Object.freeze({
  /**
   * Reparse the generated output to detect any changes to code correctness.
   */
  Full: 0,
  0: 'Full',
  /**
   * Perform no verification of the output.
   */
  None: 1,
  1: 'None',
});
/**
 * The configuration to use when formatting.
 */
export class Config {
  static __wrap(ptr) {
    const obj = Object.create(Config.prototype);
    obj.ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_config_free(ptr);
  }
  /**
   * The approximate line length to use when printing the code.
   * This is used as a guide to determine when to wrap lines, but note
   * that this is not a hard upper bound.
   */
  get column_width() {
    const ret = wasm.__wbg_get_config_column_width(this.ptr);
    return ret >>> 0;
  }
  /**
   * The approximate line length to use when printing the code.
   * This is used as a guide to determine when to wrap lines, but note
   * that this is not a hard upper bound.
   */
  set column_width(arg0) {
    wasm.__wbg_set_config_column_width(this.ptr, arg0);
  }
  /**
   * The type of line endings to use.
   */
  get line_endings() {
    const ret = wasm.__wbg_get_config_line_endings(this.ptr);
    return ret >>> 0;
  }
  /**
   * The type of line endings to use.
   */
  set line_endings(arg0) {
    wasm.__wbg_set_config_line_endings(this.ptr, arg0);
  }
  /**
   * The type of indents to use.
   */
  get indent_type() {
    const ret = wasm.__wbg_get_config_indent_type(this.ptr);
    return ret >>> 0;
  }
  /**
   * The type of indents to use.
   */
  set indent_type(arg0) {
    wasm.__wbg_set_config_indent_type(this.ptr, arg0);
  }
  /**
   * The width of a single indentation level.
   * If `indent_type` is set to [`IndentType::Spaces`], then this is the number of spaces to use.
   * If `indent_type` is set to [`IndentType::Tabs`], then this is used as a heuristic to guide when to wrap lines.
   */
  get indent_width() {
    const ret = wasm.__wbg_get_config_indent_width(this.ptr);
    return ret >>> 0;
  }
  /**
   * The width of a single indentation level.
   * If `indent_type` is set to [`IndentType::Spaces`], then this is the number of spaces to use.
   * If `indent_type` is set to [`IndentType::Tabs`], then this is used as a heuristic to guide when to wrap lines.
   */
  set indent_width(arg0) {
    wasm.__wbg_set_config_indent_width(this.ptr, arg0);
  }
  /**
   * The style of quotes to use in string literals.
   */
  get quote_style() {
    const ret = wasm.__wbg_get_config_quote_style(this.ptr);
    return ret >>> 0;
  }
  /**
   * The style of quotes to use in string literals.
   */
  set quote_style(arg0) {
    wasm.__wbg_set_config_quote_style(this.ptr, arg0);
  }
  /**
   * Whether to omit parentheses around function calls which take a single string literal or table.
   * This is added for adoption reasons only, and is not recommended for new work.
   */
  get no_call_parentheses() {
    const ret = wasm.__wbg_get_config_no_call_parentheses(this.ptr);
    return ret !== 0;
  }
  /**
   * Whether to omit parentheses around function calls which take a single string literal or table.
   * This is added for adoption reasons only, and is not recommended for new work.
   */
  set no_call_parentheses(arg0) {
    wasm.__wbg_set_config_no_call_parentheses(this.ptr, arg0);
  }
  /**
   * When to use call parentheses.
   * if call_parentheses is set to [`CallParenType::Always`] call parentheses is always applied.
   * if call_parentheses is set to [`CallParenType::NoSingleTable`] call parentheses is omitted when
   * function is called with only one string argument.
   * if call_parentheses is set to [`CallParenType::NoSingleTable`] call parentheses is omitted when
   * function is called with only one table argument.
   * if call_parentheses is set to [`CallParenType::None`] call parentheses is omitted when
   * function is called with only one table or string argument (same as no_call_parentheses).
   */
  get call_parentheses() {
    const ret = wasm.__wbg_get_config_call_parentheses(this.ptr);
    return ret >>> 0;
  }
  /**
   * When to use call parentheses.
   * if call_parentheses is set to [`CallParenType::Always`] call parentheses is always applied.
   * if call_parentheses is set to [`CallParenType::NoSingleTable`] call parentheses is omitted when
   * function is called with only one string argument.
   * if call_parentheses is set to [`CallParenType::NoSingleTable`] call parentheses is omitted when
   * function is called with only one table argument.
   * if call_parentheses is set to [`CallParenType::None`] call parentheses is omitted when
   * function is called with only one table or string argument (same as no_call_parentheses).
   */
  set call_parentheses(arg0) {
    wasm.__wbg_set_config_call_parentheses(this.ptr, arg0);
  }
  /**
   * Whether we should collapse simple structures like functions or guard statements
   * if set to [`CollapseSimpleStatement::None`] structures are never collapsed.
   * if set to [`CollapseSimpleStatement::FunctionOnly`] then simple functions (i.e., functions with a single laststmt) can be collapsed
   */
  get collapse_simple_statement() {
    const ret = wasm.__wbg_get_config_collapse_simple_statement(this.ptr);
    return ret >>> 0;
  }
  /**
   * Whether we should collapse simple structures like functions or guard statements
   * if set to [`CollapseSimpleStatement::None`] structures are never collapsed.
   * if set to [`CollapseSimpleStatement::FunctionOnly`] then simple functions (i.e., functions with a single laststmt) can be collapsed
   */
  set collapse_simple_statement(arg0) {
    wasm.__wbg_set_config_collapse_simple_statement(this.ptr, arg0);
  }
  /**
   * Configuration for the sort requires codemod
   */
  get sort_requires() {
    const ret = wasm.__wbg_get_config_sort_requires(this.ptr);
    return SortRequiresConfig.__wrap(ret);
  }
  /**
   * Configuration for the sort requires codemod
   */
  set sort_requires(arg0) {
    _assertClass(arg0, SortRequiresConfig);
    var ptr0 = arg0.ptr;
    arg0.ptr = 0;
    wasm.__wbg_set_config_sort_requires(this.ptr, ptr0);
  }
  /**
   * Creates a new Config with the default values
   * @returns {Config}
   */
  static new() {
    const ret = wasm.config_new();
    return Config.__wrap(ret);
  }
  /**
   * Returns a new config with the given column width
   * @param {number} column_width
   * @returns {Config}
   */
  with_column_width(column_width) {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.config_with_column_width(ptr, column_width);
    return Config.__wrap(ret);
  }
  /**
   * Returns a new config with the given line endings
   * @param {number} line_endings
   * @returns {Config}
   */
  with_line_endings(line_endings) {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.config_with_line_endings(ptr, line_endings);
    return Config.__wrap(ret);
  }
  /**
   * Returns a new config with the given indent type
   * @param {number} indent_type
   * @returns {Config}
   */
  with_indent_type(indent_type) {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.config_with_indent_type(ptr, indent_type);
    return Config.__wrap(ret);
  }
  /**
   * Returns a new config with the given indent width
   * @param {number} indent_width
   * @returns {Config}
   */
  with_indent_width(indent_width) {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.config_with_indent_width(ptr, indent_width);
    return Config.__wrap(ret);
  }
  /**
   * Returns a new config with the given quote style
   * @param {number} quote_style
   * @returns {Config}
   */
  with_quote_style(quote_style) {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.config_with_quote_style(ptr, quote_style);
    return Config.__wrap(ret);
  }
  /**
   * Returns a new config with the given value for `no_call_parentheses`
   * @param {boolean} no_call_parentheses
   * @returns {Config}
   */
  with_no_call_parentheses(no_call_parentheses) {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.config_with_no_call_parentheses(ptr, no_call_parentheses);
    return Config.__wrap(ret);
  }
  /**
   * Returns a new config with the given call parentheses type
   * @param {number} call_parentheses
   * @returns {Config}
   */
  with_call_parentheses(call_parentheses) {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.config_with_call_parentheses(ptr, call_parentheses);
    return Config.__wrap(ret);
  }
  /**
   * @param {number} collapse_simple_statement
   * @returns {Config}
   */
  with_collapse_simple_statement(collapse_simple_statement) {
    const ptr = this.__destroy_into_raw();
    const ret = wasm.config_with_collapse_simple_statement(
      ptr,
      collapse_simple_statement
    );
    return Config.__wrap(ret);
  }
  /**
   * Returns a new config with the given sort requires configuration
   * @param {SortRequiresConfig} sort_requires
   * @returns {Config}
   */
  with_sort_requires(sort_requires) {
    const ptr = this.__destroy_into_raw();
    _assertClass(sort_requires, SortRequiresConfig);
    var ptr0 = sort_requires.ptr;
    sort_requires.ptr = 0;
    const ret = wasm.config_with_sort_requires(ptr, ptr0);
    return Config.__wrap(ret);
  }
}
/**
 * An optional formatting range.
 * If provided, only content within these boundaries (inclusive) will be formatted.
 * Both boundaries are optional, and are given as byte offsets from the beginning of the file.
 */
export class Range {
  static __wrap(ptr) {
    const obj = Object.create(Range.prototype);
    obj.ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_range_free(ptr);
  }
  /**
   */
  get start() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_range_start(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   */
  set start(arg0) {
    wasm.__wbg_set_range_start(
      this.ptr,
      !isLikeNone(arg0),
      isLikeNone(arg0) ? 0 : arg0
    );
  }
  /**
   */
  get end() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.__wbg_get_range_end(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return r0 === 0 ? undefined : r1 >>> 0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   */
  set end(arg0) {
    wasm.__wbg_set_range_end(
      this.ptr,
      !isLikeNone(arg0),
      isLikeNone(arg0) ? 0 : arg0
    );
  }
  /**
   * Creates a new formatting range from the given start and end point.
   * All content within these boundaries (inclusive) will be formatted.
   * @param {number | undefined} start
   * @param {number | undefined} end
   * @returns {Range}
   */
  static from_values(start, end) {
    const ret = wasm.range_from_values(
      !isLikeNone(start),
      isLikeNone(start) ? 0 : start,
      !isLikeNone(end),
      isLikeNone(end) ? 0 : end
    );
    return Range.__wrap(ret);
  }
}
/**
 * Configuration for the Sort Requires codemod
 */
export class SortRequiresConfig {
  static __wrap(ptr) {
    const obj = Object.create(SortRequiresConfig.prototype);
    obj.ptr = ptr;

    return obj;
  }

  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_sortrequiresconfig_free(ptr);
  }
  /**
   * Whether the sort requires codemod is enabled
   */
  get enabled() {
    const ret = wasm.__wbg_get_sortrequiresconfig_enabled(this.ptr);
    return ret !== 0;
  }
  /**
   * Whether the sort requires codemod is enabled
   */
  set enabled(arg0) {
    wasm.__wbg_set_sortrequiresconfig_enabled(this.ptr, arg0);
  }
  /**
   * @returns {SortRequiresConfig}
   */
  static new() {
    const ret = wasm.sortrequiresconfig_new();
    return SortRequiresConfig.__wrap(ret);
  }
  /**
   * @param {boolean} enabled
   * @returns {SortRequiresConfig}
   */
  set_enabled(enabled) {
    const ret = wasm.sortrequiresconfig_set_enabled(this.ptr, enabled);
    return SortRequiresConfig.__wrap(ret);
  }
}

export function __wbindgen_string_new(arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1);
  return addHeapObject(ret);
}

export function __wbindgen_throw(arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
}

cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
