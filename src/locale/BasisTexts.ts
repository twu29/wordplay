import type { DocText, NameText, FunctionText, NameAndDoc } from './Locale';

type BasisTexts = {
    Boolean: {
        doc: DocText;
        name: NameText;
        function: {
            and: FunctionText<[NameAndDoc]>;
            or: FunctionText<[NameAndDoc]>;
            not: FunctionText<[]>;
            equals: FunctionText<[NameAndDoc]>;
            notequal: FunctionText<[NameAndDoc]>;
        };
        conversion: {
            text: DocText;
        };
    };
    None: {
        doc: DocText;
        name: NameText;
        function: {
            equals: FunctionText<[NameAndDoc]>;
            notequals: FunctionText<[NameAndDoc]>;
        };
        conversion: {
            text: DocText;
        };
    };
    Text: {
        doc: DocText;
        name: NameText;
        function: {
            length: FunctionText<[]>;
            equals: FunctionText<[NameAndDoc]>;
            notequals: FunctionText<[NameAndDoc]>;
            has: FunctionText<[NameAndDoc]>;
            starts: FunctionText<[NameAndDoc]>;
            ends: FunctionText<[NameAndDoc]>;
            repeat: FunctionText<[NameAndDoc]>;
            segment: FunctionText<[NameAndDoc]>;
            combine: FunctionText<[NameAndDoc]>;
        };
        conversion: {
            list: DocText;
            number: DocText;
        };
    };
    Number: {
        doc: DocText;
        name: NameText;
        function: {
            add: FunctionText<[NameAndDoc]>;
            subtract: FunctionText<[NameAndDoc]>;
            multiply: FunctionText<[NameAndDoc]>;
            divide: FunctionText<[NameAndDoc]>;
            remainder: FunctionText<[NameAndDoc]>;
            positive: FunctionText<[]>;
            round: FunctionText<[]>;
            roundDown: FunctionText<[]>;
            roundUp: FunctionText<[]>;
            power: FunctionText<[NameAndDoc]>;
            root: FunctionText<[NameAndDoc]>;
            lessThan: FunctionText<[NameAndDoc]>;
            greaterThan: FunctionText<[NameAndDoc]>;
            lessOrEqual: FunctionText<[NameAndDoc]>;
            greaterOrEqual: FunctionText<[NameAndDoc]>;
            equal: FunctionText<[NameAndDoc]>;
            notequal: FunctionText<[NameAndDoc]>;
            cos: FunctionText<[]>;
            sin: FunctionText<[]>;
        };
        conversion: {
            text: DocText;
            list: DocText;
            s2m: DocText;
            s2h: DocText;
            s2day: DocText;
            s2wk: DocText;
            s2year: DocText;
            s2ms: DocText;
            ms2s: DocText;
            min2s: DocText;
            h2s: DocText;
            day2s: DocText;
            wk2s: DocText;
            yr2s: DocText;
            m2pm: DocText;
            m2nm: DocText;
            m2micro: DocText;
            m2mm: DocText;
            m2cm: DocText;
            m2dm: DocText;
            m2km: DocText;
            m2Mm: DocText;
            m2Gm: DocText;
            m2Tm: DocText;
            pm2m: DocText;
            nm2m: DocText;
            micro2m: DocText;
            mm2m: DocText;
            cm2m: DocText;
            dm2m: DocText;
            km2m: DocText;
            Mm2m: DocText;
            Gm2m: DocText;
            Tm2m: DocText;
            km2mi: DocText;
            mi2km: DocText;
            cm2in: DocText;
            in2cm: DocText;
            m2ft: DocText;
            ft2m: DocText;
            g2mg: DocText;
            mg2g: DocText;
            g2kg: DocText;
            kg2g: DocText;
            g2oz: DocText;
            oz2g: DocText;
            oz2lb: DocText;
            lb2oz: DocText;
        };
    };
    List: {
        doc: DocText;
        name: NameText;
        kind: NameText;
        out: NameText;
        outofbounds: NameText;
        function: {
            add: FunctionText<[NameAndDoc]>;
            append: FunctionText<[NameAndDoc]>;
            replace: FunctionText<[NameAndDoc, NameAndDoc]>;
            length: FunctionText<[]>;
            random: FunctionText<[]>;
            first: FunctionText<[]>;
            last: FunctionText<[]>;
            has: FunctionText<[NameAndDoc]>;
            join: FunctionText<[NameAndDoc]>;
            subsequence: FunctionText<[NameAndDoc, NameAndDoc]>;
            sansFirst: FunctionText<[]>;
            sansLast: FunctionText<[]>;
            sans: FunctionText<[NameAndDoc]>;
            sansAll: FunctionText<[NameAndDoc]>;
            reverse: FunctionText<[]>;
            equals: FunctionText<[NameAndDoc]>;
            notequals: FunctionText<[NameAndDoc]>;
            translate: FunctionText<[NameAndDoc]> & {
                value: NameAndDoc;
                index: NameAndDoc;
                list: NameAndDoc;
            };
            filter: FunctionText<[NameAndDoc]> & {
                value: NameAndDoc;
                index: NameAndDoc;
                list: NameAndDoc;
            };
            all: FunctionText<[NameAndDoc]> & {
                value: NameAndDoc;
                index: NameAndDoc;
                list: NameAndDoc;
            };
            until: FunctionText<[NameAndDoc]> & {
                value: NameAndDoc;
                index: NameAndDoc;
                list: NameAndDoc;
            };
            find: FunctionText<[NameAndDoc]> & {
                value: NameAndDoc;
                index: NameAndDoc;
                list: NameAndDoc;
            };
            combine: FunctionText<[NameAndDoc, NameAndDoc]> & {
                combination: NameAndDoc;
                next: NameAndDoc;
                index: NameAndDoc;
                list: NameAndDoc;
            };
        };
        conversion: {
            text: DocText;
            set: DocText;
        };
    };
    Set: {
        doc: DocText;
        name: NameText;
        kind: NameText;
        out: NameText;
        function: {
            equals: FunctionText<[NameAndDoc]>;
            notequals: FunctionText<[NameAndDoc]>;
            add: FunctionText<[NameAndDoc]>;
            remove: FunctionText<[NameAndDoc]>;
            union: FunctionText<[NameAndDoc]>;
            intersection: FunctionText<[NameAndDoc]>;
            difference: FunctionText<[NameAndDoc]>;
            filter: FunctionText<[NameAndDoc]> & {
                value: NameAndDoc;
                set: NameAndDoc;
            };
            translate: FunctionText<[NameAndDoc]> & {
                value: NameAndDoc;
                set: NameAndDoc;
            };
        };
        conversion: {
            text: DocText;
            list: DocText;
        };
    };
    Map: {
        doc: DocText;
        name: NameText;
        key: NameText;
        value: NameText;
        result: NameText;
        function: {
            equals: FunctionText<[NameAndDoc]>;
            notequals: FunctionText<[NameAndDoc]>;
            set: FunctionText<[NameAndDoc, NameAndDoc]>;
            unset: FunctionText<[NameAndDoc]>;
            remove: FunctionText<[NameAndDoc]>;
            filter: FunctionText<[NameAndDoc]> & {
                key: NameAndDoc;
                value: NameAndDoc;
                map: NameAndDoc;
            };
            translate: FunctionText<[NameAndDoc]> & {
                key: NameAndDoc;
                value: NameAndDoc;
                map: NameAndDoc;
            };
        };
        conversion: {
            text: DocText;
            set: DocText;
            list: DocText;
        };
    };
    Table: {
        doc: DocText;
        name: NameText;
        function: {
            equals: FunctionText<[NameAndDoc]>;
            notequal: FunctionText<[NameAndDoc]>;
        };
        conversion: {
            list: DocText;
            text: DocText;
        };
    };
};

export default BasisTexts;
