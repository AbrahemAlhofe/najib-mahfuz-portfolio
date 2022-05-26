export enum LibraryModes { Browsing, Inspecting }
export type TEvents = {
    intersection: IntersectionObserverEntry;
    next: number;
    ["book:click"]: HTMLDivElement;
};

export type TBook = {
    title: string;
    thumbnail: string;
}