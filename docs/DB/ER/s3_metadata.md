# s3_metadataを中心としたid_card・permit ER図

```mermaid
erDiagram

s3_metadata {
    number id PK
}

id_card {
    number id PK
    number front_s3_metadata_id FK
    number rear_s3_metadata_id FK
}

permit {
    number id PK
}

permit_file {
    number id PK
    number permit_id FK
    number s3_metadata_id FK
}

user {
    number id PK
    number idcard_id FK
}

shop_signup {
    number id PK
    number idcard_id FK
    number permit_id FK
}

shop_info {
    number id PK
    number idcard_id FK
    number permit_id FK
}

shop_info_edit {
    number id PK
    number idcard_id FK
    number permit_id FK
}

s3_metadata o|--o| id_card : "1つのs3_metadataは0または1つのid_cardで表面画像として使用される"

s3_metadata o|--o| id_card : "1つのs3_metadataは0または1つのid_cardで裏面画像として使用される"

s3_metadata o|--o| permit_file : "1つのs3_metadataは0または1つのpermit_fileで使用される"

id_card o|--o| user : "1つのid_cardは0または1人のuserで使用される"

id_card o|--o| shop_signup : "1つのid_cardは0または1つのshop_signupで使用される"

id_card o|--o| shop_info : "1つのid_cardは0または1つのshop_infoで使用される"

id_card o|--o| shop_info_edit : "1つのid_cardは0または1つのshop_info_editで使用される"

permit o|--o| shop_info : "1つのpermitは0または1つのshop_infoで使用される"

permit o|--o| shop_signup : "1つのpermitは0または1つのshop_signupで使用される"

permit o|--o| shop_info_edit : "1つのpermitは0または1つのshop_info_editで使用される"

permit o|--o{ permit_file : "1つのpermitは0以上のpermit_fileを持つ"
```
