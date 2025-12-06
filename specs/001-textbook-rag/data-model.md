# Data Model: Physical AI & Humanoid Robotics — Essentials Textbook with RAG Chatbot

**Feature Branch**: `001-textbook-rag`
**Created**: 2025-12-06
**Spec**: [specs/001-textbook-rag/spec.md](specs/001-textbook-rag/spec.md)

## Key Entities

### Textbook Chapter
Represents a distinct section of the textbook with content, title, and order.
- **Attributes**:
    - `id`: Unique identifier (e.g., string slug or numeric)
    - `title`: Display title of the chapter
    - `content`: Markdown content of the chapter
    - `order`: Numeric order for display and navigation
    - `sections`: List of sub-sections (can be nested for hierarchy)

### Chatbot Query
User's natural language input to the RAG chatbot.
- **Attributes**:
    - `id`: Unique query identifier
    - `text`: The natural language question from the user
    - `context_text`: Optional, specific text selected by the user to provide context for the query
    - `timestamp`: Time of query submission

### Chatbot Response
AI-generated answer based on textbook content, potentially synthesized and summarized.
- **Attributes**:
    - `id`: Unique response identifier
    - `query_id`: Reference to the original Chatbot Query
    - `answer`: The AI-generated response text
    - `sources`: List of textbook sections/pages used to generate the answer
    - `timestamp`: Time of response generation

### Text Embedding
Vector representation of textbook text used for RAG (leveraging cloud-provider free-tier embedding services for simplicity).
- **Attributes**:
    - `id`: Unique embedding identifier (e.g., hash of text segment + model version)
    - `text_segment`: The chunk of textbook text that was embedded
    - `vector`: Numeric vector representation of the text segment
    - `chapter_id`: Reference to the Textbook Chapter it belongs to

### User Preference
Settings for optional features like language or personalization.
- **Attributes**:
    - `user_id`: Unique identifier for the user (if authenticated, otherwise session-based)
    - `language_preference`: (e.g., "en", "ur")
    - `personalization_settings`: (e.g., theme, content display options)
