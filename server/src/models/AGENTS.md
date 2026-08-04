# Model Agent Instructions

## 対象

このディレクトリの Model を作成・修正する場合に適用する。

## 最優先ルール

- Model を唯一の正（Single Source of Truth）とする。
- DB 設計は必ず Model から行う。
- migration や他ファイルから Model を推測・変更しない。
- 指示された範囲以外の Model は変更しない。

## コーディング規約

Model の実装は以下の規約に必ず従う。

docs/rule/backend/coding_rule/model.md

## migration との関係

- Model を変更した場合は、必要な migration も作成する。
- migration は Model を忠実に反映する。
- migration のみ変更して Model を変更しないことは禁止。

## 実装時の注意

- 同じ Model 内の既存コードの記述スタイルを維持する。
- 規約と既存コードが矛盾する場合は、規約を優先し、不明点は報告する。
- 独自判断による仕様追加・制約追加・命名変更は行わない。
