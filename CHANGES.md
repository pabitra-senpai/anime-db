# Changed / new files only

Modified (already existed in your repo):
- lib/api/types.ts
- lib/api/metadata-service.ts
- lib/api/providers/anilist/queries.ts
- lib/api/providers/anilist/normalize.ts
- app/anime/[slug]/page.tsx

New (didn't exist before):
- lib/api/providers/jikan/client.ts
- lib/api/providers/jikan/types.ts
- lib/api/providers/jikan/normalize.ts
- lib/api/providers/jikan/index.ts
- lib/api/providers/kitsu/client.ts
- lib/api/providers/kitsu/types.ts
- lib/api/providers/kitsu/normalize.ts
- lib/api/providers/kitsu/index.ts
- components/anime/EpisodeList.tsx
- components/anime/CastList.tsx
- components/anime/StaffList.tsx

Drop these into your existing repo at the same paths (they'll overwrite the
5 modified files and add the 11 new ones). No other files were touched.
