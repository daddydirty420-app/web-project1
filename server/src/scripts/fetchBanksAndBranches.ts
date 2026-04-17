import { Banks, Branches } from '../models/index.js';
import sequelize from '../db.js';

(async () => {
    let t;
    try {
        await sequelize.authenticate();
        console.log('DB接続成功！');

        t = await sequelize.transaction();

        let allBanks: any[] = [];
        let page = 1;

        while (true) {
            const res = await fetch(`https://bank.teraren.com/banks.json?page=${page}`);
            const data = await res.json();
            if (!Array.isArray(data) || data.length === 0) break;
            allBanks = allBanks.concat(data);
            page++;
        }

        console.log(`銀行データ${allBanks.length}件取得完了！`);

        await Banks.bulkCreate(
            allBanks.map((bank) => ({
                code: bank.code,
                name: bank.name,
                kana: bank.kana,
                hira: bank.hira,
                normalize: bank.normalize,
            })),
            {
                updateOnDuplicate: ['name', 'kana', 'hira', 'normalize'],
                transaction: t,
            },
        );

        console.log('銀行データ登録完了！');

        for (const bank of allBanks) {
            let allBranches: any[] = [];
            let branchPage = 1;

            while (true) {
                const res = await fetch(`https://bank.teraren.com/banks/${bank.code}/branches.json?page=${branchPage}`);
                const branchData = await res.json();
                if (!Array.isArray(branchData) || branchData.length === 0) break;
                allBranches = allBranches.concat(branchData);
                branchPage++;
            }

            if (allBranches.length > 0) {
                await Branches.bulkCreate(
                    allBranches.map((branch) => ({
                        bank_code: bank.code,
                        code: branch.code,
                        name: branch.name,
                        kana: branch.kana,
                        hira: branch.hira,
                        normalize: branch.normalize,
                    })),
                    {
                        updateOnDuplicate: ['name', 'kana', 'hira', 'normalize'],
                        transaction: t,
                    },
                );
            }

            console.log(`${bank.name}の支店${allBranches.length}件登録完了`);
        }
        await t.commit();

        console.log('全銀行、支店データ登録完了');
        process.exit(0);
    } catch (err) {
        if (t) await t.rollback();
        console.error('銀行データ登録エラー：', err);
        process.exit(1);
    }
})();
