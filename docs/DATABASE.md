# Database Organization

This project uses a MySQL database with the following structure:

```mermaid
erDiagram
    USERS {
        int id PK
        varchar username
        varchar email
        varchar hashed_password
        timestamp created_at
    }
    SERVICES {
        int id PK
        varchar name
        text description
        timestamp created_at
    }
    WIDGETS {
        int id PK
        varchar name
        json config
        int user_id FK
        int service_id FK
        timestamp created_at
    }
    USERS ||--o{ SERVICES : "has"
    WIDGETS }o--|| SERVICES : "provides"
