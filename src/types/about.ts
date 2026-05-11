export interface IAboutStat {
  value: string;
  title: string;
  description: string;
}

export interface IAboutResult {
  value: string;
  title: string;
  description: string;
}

export interface IWhyChooseKnowlix {
  title: string;
  subtitle: string;
  icon: string;
}

export interface IYearBaseJourney {
  year: string;
  title: string;
  description: string[];
}

export interface IAboutHighlight {
  icon: string;
  title: string;
  subtitle: string;
}

export interface ISocialMediaLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface IAboutPayload {
  id?: string;
  mainPageFeatureImage?: string | File;
  mainPageTag: string;
  mainPageTitle: string;
  mainPageSubtitle: string;
  stats: IAboutStat[];
  results: IAboutResult[];
  whyChooseKnowlix: IWhyChooseKnowlix[];
  yearBaseJourney: IYearBaseJourney[];
  aboutHighlights?: IAboutHighlight[];
  socialMediaLinks?: ISocialMediaLinks;
}
