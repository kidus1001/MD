# Product Requirement Document (PRD)

## Product Requirements

1. Problem
   - Most of the time, musicians/ performers aren't organized with their musics and majors. That they forgot about which lyric is in whoich and stuff.
     - Existing tools are either manual _pen and paper_ or applications not tiler made for musicians (_Note apps_)
   - **Need**: A tailor made plaform for musicians, where they can organize their lyric and melodies neatly.

2. Solution (_What s going to be built_)
   - The **_Mezmur Debter_** application is a platform that allows users to
     - Write Lyric (With infos about who participated in the lyric / melody)
     - Organize the lyric in folders. A single repository for single projects. Built in will be prepared.
     - Login progress of the melody alongside the lyric.
     - Log in which major they played the song in their samples.
     - Can search anything based on poem by, melody by, scale, album or single project titles.

3. **Platform Scope (_V1_)**

- The MVP will launch as a **Web app** at first. And later we will create a **Mobile Version** for it.

4. **Target Audience**

- Musicians and performers
- Lyrisists and poets
- Producers and arrangers
- Church / cultural music groups

5. **Non Goals (Out of Scope for V1)**

- Audio playback / recording
- collaboration (real time editing between users)
- Monetization / payement
- Publishing / sharing publicly
- Multi-language UI (_V1 will be English only UI_)

6. **Core Features**

- Lyric Editor
  - Rich text or plain textr editor
  - Fields for: title, lyric body, poem contributors, melody contributors, sung by, scale/ major, notes
  - Autosave every few seconds.
- Project Organization
  - Create folders (Projects / albums)
  - Different versions of the melodies can be saved inside a given file
  - Built-in starter templates (_Single_, _Album Project_)
- Progress Tracker
  - Status per file. Idea -> Draft -> Composed -> Rehearsed -> Recorded -> Released.
  - User can fill in the percent - on how much satisfied and finished the file is.
  - And for the whole albums' percent, it will calculate the individual percents and take an average on how much done **_by percent_** the given project is.
- Scale / Major log
  - Drop down of common Ethiopian scales (Tizita, Selamta, Anchihoye, Ambassel) and custom.
  - Dropdown of the major. (C, C#, D, D#, E, F, F#, G, G#, A, A#, B, C)
  - Can switch whether someone wants to see **#** or **b**. As a profile settings. But by default - it will be in **_#_**.
- Search and Filter
  - Search by keyword (title, lyric body)
  - Filter by: poem by, melody by, scale, project, status, major
- User Account
  - Register / login
  - Profile: name, email, preferences

7. **User Stories**
   - As a lyricist, I want to write lyrics with credits, so that I don't forget including their credits.
   - As a musician, I want to organize songs into album folders, so that I can find everything in one place.
   - As a musician, I want to just get my poems directly by searching them in a browser, so that I don't hustle when called for a performance.
   - As a performer, I want to log the scale (major) of each song, so that I remember how I played it last time.
   - As a composer, I want to see the progress status of each song, so that I know what still needs work.
   - As a user, I want to search by scale or contributor, so that I can quickly find related songs.

8. User Flow (_High Level_)
   - Open App
   - [First time?] -> Register -> Dashboard (empty state)
   - Dashboard -> [ + New Project ] or [ + New Song ]
   - Fill song form (title, lyric, credits, scale, status) + Playlist (Dropdown) - [First time?] - Untitled, +
   - Add melody, recording of the song as well. You can add as many (as you keep on refining them)
   - Save -> Song appears in a project folder if specified or "Untitled Folder"
   - Search / Filter -> Find song by scale, contributor, by single date, range of dates or keyword (a word in lyric, any word)

9. Design Principles
   - Musician-first - terminology matches how musicians actually speak. (Poem by, melody by, Scale)
   - Fast entry - Saving a song must be quick
   - Visual clarity - Status and scale are visible at a glance
   - Amharic-friendly - Full support for Ethiopic script input and display
   - Minimal - No feature bloat, V1 does one thing very well, and has got audio saving feature, which will be refined in the future versions.

## Technical Architecture

1. **High-Level Flow**
   - User opens web app
   - Logs in (JWT auth)
   - Creates project / song
   - Data stored in MongoDB
   - Search index updated (for keyword search)
   - Dashboard, folders, search reflect new data

2. **Tech Stack**
   - Frontend - React
   - Styling - tailwind CSS
   - Backend - Node.js + Express
   - Database - MongoDB
   - Search - Meilisearch (New to learn)
   - Hosting - A real domain. That I will also use in the future for my portfolio
   - Audio storage - Supabase Storage (Free tier + something to learn)

3. **Data Models**

```
User {
    id: UUID
    name: string
    email: string
    password_hash: string
    preferences: {
        accidental: enum("sharp", "flat")
        theme: enum("light", "dark")
    }
    created_at: timestamp
}

Project {
    id: UUID
    user_id: UUID
    title: string
    type: enum ("Album", "Single", "Untitled")
    description: string
    percent: number
    song_count: number
    created_at: timestamp
    updated_at: timestamp
}

Song {
    id: UUID
    user_id: UUID
    project_id: UUID
    title: string
    lyric_body: text
    poem_by: string
    melody_by: string
    sung_by: string
    scale: string //Tizita, Selamta, Anchihoye etc...
    major: string //C, C#, D, . . .
    status: enum ("idea", "draft", "composed", "rehearsed", "recorded", "released")
    percent: number
    notes: text
    created_at: timestamp
    updated_at: timestamp
}

Recording {
    id: UUID
    song_id: UUID
    user_id: UUID
    title: string
    file_url: string
    file_size: number //bytes
    duration: number //minutes / second
    mime_type: string
    version: number //Auto-incremented (1,2,3 . . . )
    notes: text
    created_at: timestamp
}

Tag {
    id: UUID
    user_id: UUID
    name: string
}

SongTag {
    song_id: UUID
    tag_id: UUID
}
```

4. **API Endpoints (_Sketch_)**
   - **_Auth_**
     - POST /api/auth/register -> Create Account
     - POST /api/auth/login -> Get JWT
     - POST /api/auth/refresh -> Refresh access token
     - POST /api/auth/logout -> Invalidate refresh
     - GET /api/auth/profile -> Current User
     - PUT /api/auth/profile -> Update name/email/preferences (**_#_** or **_b_**)
     - POST /api/auth/forgot-password
     - POST /api/auth/reset-password/:token

   - **_Projects_**
     - GET /api/projects -> List user's projects
     - POST /api/projects -> Create project
     - GET /api/projects/:id -> Project detail + songs
     - PUT /api/projects/:id -> Update
     - DELETE /api/projects/:id -> Delete
     - GET /api/projects/:id/stats -> Project percent + song count breakdown
     - GET /api/projects/:id/export?format=pdf
   - **_Songs_**
     - GET /api/songs?page=1&limit=20 -> List (filters: scale, status, project), Pagination when a user has lets say 500+ songs.
     - POST /api/songs -> Create song
     - GET /api/songs/:id -> Song detail
     - PUT /api/songs/:id -> Update
     - DELETE /api/songs/:id -> Delete
     - GET /api/songs?scale=&major=&status=&project_id=&tag=&q=
     - GET /api/songs?sort=title&order=asc
     - GET /api/songs?sort=updated_at&order=desc
     - GET /api/songs/:id/export?format=pdf

   - **_Recordings_**
     - POST /api/songs/:id/recordings -> Upload audio file
     - GET /api/songs/:id/recordings -> List recordings for a song
     - GET /api/recordings/:recordingId -> Get one
     - DELETE /api/recordings/:recordingId -> Delete recording
     - PUT /api/recordings/:recordingId -> Update metadata (title, notes)
     * Constraints: Max 50MB per file. Allowed: mp3, wav, m4a, ogg. Max 20 recordings per song.

   - **_Tag_**
     - GET /api/tags -> List user's tags
     - POST /api/tags -> Create tag
     - DELETE /api/tags/:id -> Delete tag
     - POST /api/songs/:id/tags -> Add tag to a song
     - DELETE /api/songs/:id/tags/:tagId -> Remove tag from a song

   - **_Search_**
     - GET /api/songs?q=&scale=&poem_by=&melody_by=&project_id=

   - **_Scales (Reference)_**
     - GET /api/scales -> List available scales

   - **_Export everything_**
     - GET /api/export?format=pdf

5. Users should be able to export folder or projects and songs to PDF.

**NB:**

- Rate Limit by IP Address (especially /auth/login, /auth/register: max 5 attempts/min)
- Max upload size: 50MB per recording
- Pagination default: 20 items per page (max 100)
