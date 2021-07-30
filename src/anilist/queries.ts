export const MEDIA_QUERY = `
query (
    $id: Int,
    $page: Int,
    $perPage: Int,
    $search: String,
    $type: MediaType,
    $sort: [MediaSort] = [SEARCH_MATCH],
    $exclude: MediaFormat,
    $isAdult: Boolean
  ) {
    Page(page: $page, perPage: $perPage) {
      media(id: $id, search: $search, type: $type, sort: $sort, format_not: $exclude, isAdult: $isAdult) {
        id
        type
        format
        title {
          english
          romaji
          native
        }
        synonyms
        status
        description
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        episodes
        chapters
        volumes
        coverImage {
          large
          color
        }
        bannerImage
        genres
        averageScore
        siteUrl
        popularity
      }
    }
  }
`;
