export const SEARCH_QUERY = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      currentPage
      lastPage
      hasNextPage
    }
    media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        extraLarge
      }
      averageScore
      meanScore
      genres
      episodes
      format
      status
      season
      seasonYear
      startDate {
        year
        month
        day
      }
    }
  }
}
`;

export const DETAIL_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title {
      romaji
      english
      native
    }
    coverImage {
      large
      extraLarge
    }
    bannerImage
    description
    genres
    tags {
      name
      rank
    }
    studios(isMain: true) {
      nodes {
        name
      }
    }
    episodes
    duration
    status
    format
    season
    seasonYear
    averageScore
    meanScore
    popularity
    favourites
    source
    trailer {
      id
      site
    }
    characters(page: 1, perPage: 8) {
      nodes {
        id
        name {
          full
        }
        image {
          large
        }
      }
    }
    relations {
      nodes {
        id
        title {
          romaji
        }
        format
      }
    }
    externalLinks {
      url
      site
    }
  }
}
`;
