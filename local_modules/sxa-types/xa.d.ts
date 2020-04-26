interface HashTable<T> {
    [key: string]: T;
}

export interface XAComponent {
    initInstance?: (component: JQuery, module: JQuery) => void
    init?: () => void;
}

export interface XAStatic {
    //
    register: (name: string, api?: any, init?: () => void) => void;
    hasPageModes: () => boolean;
    registerOnPreInitHandler: (handler: () => void) => void;
    registerOnPostInitHandler: (handler: () => void) => void;
    init: () => void;
    ready: (fn: () => void) => void;

    component: HashTable<XAComponent>;
    connector: any;
    cookies: {
        createCookie: (name: string, value: string, days: number) => void,
        readCookie: (name: string) => string | null,
        removeCookieWarning: () => void
    },
    queryString: {
        getQueryParam: (variable: string) => string
    },
    dom: {
        observeDOM: (obj: Node, callback: () => void) => void
    }
}