export interface ICategory {
  id: number;
  parentId?: number;
  imagePNG?: string | null;
  imageSVG?: string | null;
  type?: string;
  title: string;
  tag_title?: string;

  isActive: boolean;
  sort: number | null;

  useEmoji?: boolean;
  emoji: string;
}


export interface ILocalCategory {
  id: number | string;
  tagId?: number | null;
  imagePNG?: string | null;
  imageSVG?: string | null;
  tag?: ICategory | null;
  type?: string;
  title: string;

  useEmoji?: boolean;
  emoji?: string;
}


export interface ICategoryFilterVariables {
  textSearch: string;
}
