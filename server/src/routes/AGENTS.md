# routes/AGENTS.md

## 対象

このディレクトリ内の Route を作成・修正する場合に適用する。

## 基本方針

-   Route はルーティング定義のみを担当する。
-   Route 内にリクエスト処理、業務ロジック、DB 操作を書かない。
-   Route には以下のみを記述する。
    -   HTTP メソッド
    -   パス
    -   middleware
    -   Controller
    -   Route の概要コメント

## Controller との関係

-   既存の無名ハンドラーは、挙動を変えず Controller へ移動する。
-   Controller 分離時に、URL、HTTP メソッド、middleware の順序、レスポンス内容を変更しない。
-   共通化や UseCase 再設計は行わない。
-   指示された Route 以外は変更しない。

## ルール

-   ルーティングの上に、3 行コメントを記載する（現段階で記載されていないものについては、コメントなし可）
    -   パス（/api 以下）
    -   処理概要
    -   フロントの対応ページ
-   3 行コメントは route を正とし、controller や usecase などのコメントとずれている場合は、route のものに直す

## 例外

-   prototype、maintenance、script 用途の処理は通常 Route へ移さない。
