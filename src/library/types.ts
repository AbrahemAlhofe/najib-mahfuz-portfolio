export enum LibraryModes { Browsing, Inspecting }
export type TEvents = {
    intersection: IntersectionObserverEntry;
    next: number;
    move: any;
    ["book:click"]: HTMLDivElement;
};

export type TBook = {
    title: string;
    thumbnail: string;
}