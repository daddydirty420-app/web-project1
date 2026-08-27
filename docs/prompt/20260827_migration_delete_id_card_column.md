/server/src/models/id_card.tsを見て、`id_card_front`と`id_card_rear`カラムを削除するマイグレーションを、/server/migration/20260827091123-delete-idcard-column.jsに書いてください。マイグレーションの実行はしないでください。

マイグレーションファイルに、modelにはない、以下のCHECK制約を追加してください。

```sql
ALTER TABLE id_card
ADD CONSTRAINT chk_id_card_front_rear_different
 CHECK (
    front_s3_metadata_id IS NULL
    OR rear_s3_metadata_id IS NULL
    OR front_s3_metadata_id <> rear_s3_metadata_id
);
```

マイグレーションファイルへの記入が終わったら、再度modelファイルを見て、`id_card_front`と`id_card_rear`をmodelファイルから削除してください。

/server/src/models/id_card.tsと/server/migration/20260827091123-delete-idcard-column.jsを除き、既存のコードは一切編集しないでください。
