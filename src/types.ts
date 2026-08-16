export type Props = Record<string,any>;

export type VNode = {
  type: string;
  props: Props;
  children: Child[];
};

export type Child = string | number | VNode;