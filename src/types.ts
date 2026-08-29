export type Props = Record<string, any>;

export type Key = string | null;

export type VNode = {
    type: string;
    key: string | null;
    props: Props;
    children: Child[];
};

export type Child = string | VNode;
