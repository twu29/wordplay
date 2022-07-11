export enum SemanticConflict {
    EXPECTED_BLOCK_EXPRESSION,
    EXPECTED_BLOCK_LAST_EXPRESSION,
    IGNORED_BLOCK_EXPRESSION,
    BIND_ALIASES_ARENT_UNIQUE,
    SHARE_NOT_ALLOWED,
    SHARING_REQUIRES_LANGUAGES,
    UNDEFINED_NAME,
    UNKNOWN_NAME_ON_TYPE,
    DOC_LANGUAGES_ARENT_UNIQUE,
    UNKNOWN_TYPE,
    BINDS_MISSING_VALUES,
    INCOMPATIBLE_TYPES,
    EXPECTED_BOOLEAN_CONDITION,
    EXPECTED_MATCHING_CONDITION_TYPES,
    FUNCTION_INPUT_NAMES_MUST_BE_UNIQUE,
    TYPE_INPUT_NAMES_MUST_BE_UNIQUE,
    INCOMPATIBLE_KEY_TYPE,
    LIST_INDEX_ISNT_NUMBER,
    LIST_VALUES_ARENT_SAME_TYPE,
    NEITHER_SET_NOR_MAP,
    SET_VALUES_ARENT_SAME_TYPE,
    MAP_KEYS_ARENT_SAME_TYPE,
    MAP_VALUES_ARENT_SAME_TYPE,
    TYPE_VARS_ARENT_UNIQUE,
    BINARY_OPERANDS_ARE_INCOMPATIBLE,
    ARITHMETIC_REQUIRES_NUMBERS,
    LOGIC_REQUIRES_BOOLEANS,
    CONVERSIONS_ONLY_IN_TYPES,
    EXPECTED_LANGUAGE,
    EXPECTED_STREAM,
    STREAM_VALUES_INCOMPATIBLE
}