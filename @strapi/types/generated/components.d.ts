import type { Schema, Struct } from '@strapi/strapi';

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    target_blank: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLinkSocial extends Struct.ComponentSchema {
  collectionName: 'components_shared_link_socials';
  info: {
    displayName: 'LinkSocial';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    target_blank: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    text: Schema.Attribute.String;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
  };
  attributes: {
    hasADifferentImageOnViewports: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    isLg: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    isMd: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    isSm: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    isXs: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lg: Schema.Attribute.Media<'images' | 'videos'>;
    md: Schema.Attribute.Media<'images' | 'videos'>;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    sm: Schema.Attribute.Media<'images' | 'videos'>;
    xs: Schema.Attribute.Media<'images' | 'videos'>;
  };
}

export interface SharedMediaGallery extends Struct.ComponentSchema {
  collectionName: 'components_shared_media_galleries';
  info: {
    description: 'Gallery of images and videos';
    displayName: 'Media Gallery';
    icon: 'images';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.media', true>;
  };
}

export interface WidgetsCardBase extends Struct.ComponentSchema {
  collectionName: 'components_widgets_card_bases';
  info: {
    displayName: 'CardBase';
  };
  attributes: {
    description: Schema.Attribute.Text;
    hasImage: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    hasLink: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    hasPrice: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    image: Schema.Attribute.Component<'shared.media', false>;
    link: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    title: Schema.Attribute.String;
  };
}

export interface WidgetsSeo extends Struct.ComponentSchema {
  collectionName: 'components_widgets_seos';
  info: {
    displayName: 'Seo';
  };
  attributes: {
    description: Schema.Attribute.Text;
    keywords: Schema.Attribute.String;
    ogImage: Schema.Attribute.Media<'images'>;
    structuredData: Schema.Attribute.JSON;
    theme: Schema.Attribute.String &
      Schema.Attribute.CustomField<'plugin::color-picker.color'>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.link': SharedLink;
      'shared.link-social': SharedLinkSocial;
      'shared.media': SharedMedia;
      'shared.media-gallery': SharedMediaGallery;
      'widgets.card-base': WidgetsCardBase;
      'widgets.seo': WidgetsSeo;
    }
  }
}
