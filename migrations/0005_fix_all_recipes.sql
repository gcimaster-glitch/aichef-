-- Phase 2: レシピデータ修正（簡略版）
-- 手順のみを修正し、is_activeを1に設定
-- 材料は既存のもの（野菜・油・塩など）を使用

-- 1-10: 最初の10件
UPDATE recipes SET steps_json = '["小松菜は根元を切り落とし、5cm幅に切る。","沸騰したお湯で小松菜を1分茹で、冷水にとって水気を絞る。","ボウルに醤油とだしを混ぜ、小松菜を和える。","器に盛り、かつお節をかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_011';
UPDATE recipes SET steps_json = '["白菜は一口大のざく切りにする。","ボウルに白菜、塩、昆布、千切りにした生姜を入れて混ぜる。","重しをして冷蔵庫で2時間以上漬ける。","水気を軽く絞って器に盛り完成。"]', is_active = 1 WHERE recipe_id = 'side_012';
UPDATE recipes SET steps_json = '["なすはヘタを取り、縦半分に切ってから斜め切りにする。","鍋に油を熱し、なすを焼き色がつくまで炒める。","だし、醤油、みりん、千切り生姜を加えて中火で10分煮る。","火を止めて粗熱を取り、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_013';
UPDATE recipes SET steps_json = '["里芋は皮をむいて一口大に切り、水にさらす。","鍋に里芋とだしを入れて中火で10分煮る。","醤油、砂糖、みりんを加えて落し蓋をし、15分煮る。","火を止めて5分蒸らし、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_014';
UPDATE recipes SET steps_json = '["鶏肉は一口大に切る。野菜は乱切り、こんにゃくは手でちぎる。","鍋に油を熱し、鶏肉を炒める。色が変わったら野菜を加える。","だし、醤油、砂糖、みりんを加えて落し蓋をし、20分煮る。","火を止めて5分蒸らし、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_015';
UPDATE recipes SET steps_json = '["がんもどきは熱湯をかけて油抜きをする。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","がんもどきを加えて落し蓋をし、中火で15分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_016';
UPDATE recipes SET steps_json = '["こんにゃくは手でちぎり、熱湯で2分茹でてアク抜きをする。","鍋にだし、醤油、みりん、砂糖、赤唐辛子を入れて煮立てる。","こんにゃくを加えて中火で15分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_017';
UPDATE recipes SET steps_json = '["大豆は水気を切る。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","大豆を加えて落し蓋をし、中火で20分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_018';
UPDATE recipes SET steps_json = '["れんこんは薄切りにして酢水にさらす。にんじんは細切りにする。","フライパンにごま油を熱し、水気を切ったれんこんとにんじんを炒める。","醤油、砂糖、みりん、赤唐辛子を加えて汁気がなくなるまで炒める。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_019';
UPDATE recipes SET steps_json = '["もやしは洗って水気を切る。","沸騰したお湯でもやしを1分茹で、ザルにあげて水気を切る。","ボウルにごま油、塩、すりおろしたにんにくを混ぜる。","もやしを加えて和え、白ごまをかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_020';

-- 11-20
UPDATE recipes SET steps_json = '["ブロッコリーは小房に分け、茎は皮をむいて薄切りにする。","沸騰したお湯でブロッコリーを2分茹で、冷水にとる。","ボウルに醤油とだしを混ぜ、ブロッコリーを和える。","器に盛り、かつお節をかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_021';
UPDATE recipes SET steps_json = '["アスパラガスは根元を切り落とし、4cm幅に切る。","沸騰したお湯でアスパラガスを2分茹で、冷水にとる。","ボウルに醤油とだしを混ぜ、アスパラガスを和える。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_022';
UPDATE recipes SET steps_json = '["いんげんは筋を取り、3cm幅に切る。","沸騰したお湯でいんげんを2分茹で、冷水にとる。","ボウルにすりごま、砂糖、醤油を混ぜる。","いんげんを加えて和え、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_023';
UPDATE recipes SET steps_json = '["オクラは塩でもみ、産毛を取る。","沸騰したお湯でオクラを1分茹で、冷水にとる。","斜め半分に切り、醤油とだしで和える。","器に盛り、かつお節をかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_024';
UPDATE recipes SET steps_json = '["トマトは一口大に切る。","ボウルにオリーブオイル、バルサミコ酢、塩、こしょうを混ぜる。","トマトを加えて和え、冷蔵庫で30分冷やす。","器に盛り、バジルを飾って完成。"]', is_active = 1 WHERE recipe_id = 'side_025';
UPDATE recipes SET steps_json = '["ピーマンは縦半分に切り、種を取る。","沸騰したお湯でピーマンを2分茹で、冷水にとる。","細切りにし、醤油とだしで和える。","器に盛り、かつお節をかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_026';
UPDATE recipes SET steps_json = '["春雨は熱湯で戻し、食べやすい長さに切る。","きゅうり、ハムは細切りにする。","ボウルに酢、醤油、砂糖、ごま油を混ぜる。","春雨、きゅうり、ハムを加えて和え、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_027';
UPDATE recipes SET steps_json = '["マカロニは塩を入れた熱湯で茹で、冷水で冷やす。","きゅうり、ハム、玉ねぎは薄切りにする。","ボウルにマヨネーズ、酢、塩、こしょうを混ぜる。","マカロニ、野菜を加えて和え、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_028';
UPDATE recipes SET steps_json = '["キャベツは千切りにし、塩を振って10分置く。","水気を絞り、ボウルに入れる。","マヨネーズ、酢、砂糖を混ぜる。","キャベツに加えて和え、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_029';
UPDATE recipes SET steps_json = '["レタスは一口大にちぎり、冷水でパリッとさせる。","ドレッシングを作る：マヨネーズ、パルメザンチーズ、レモン汁、にんにくを混ぜる。","レタスを器に盛り、ドレッシングをかける。","クルトン、パルメザンチーズを散らして完成。"]', is_active = 1 WHERE recipe_id = 'side_030';

-- 21-30
UPDATE recipes SET steps_json = '["大根は厚めのいちょう切りにする。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","大根を加えて落し蓋をし、中火で20分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_031';
UPDATE recipes SET steps_json = '["かぶは皮をむいて4等分に切る。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","かぶを加えて落し蓋をし、中火で15分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_032';
UPDATE recipes SET steps_json = '["じゃがいもは一口大に切る。豚ひき肉は炒める。","鍋に油を熱し、ひき肉を炒める。","じゃがいも、だし、醤油、砂糖、みりんを加えて煮る。","汁気が少なくなるまで煮て、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_033';
UPDATE recipes SET steps_json = '["さつまいもは輪切りにし、水にさらす。","鍋に水、砂糖、醤油を入れて煮立てる。","さつまいもを加えて落し蓋をし、中火で15分煮る。","火を止めて冷まし、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_034';
UPDATE recipes SET steps_json = '["枝豆は塩を振り、もみ洗いする。","沸騰したお湯に塩を加え、枝豆を4分茹でる。","ザルにあげ、塩を振る。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_035';
UPDATE recipes SET steps_json = '["きゅうりは薄切りにし、塩を振って10分置く。","水気を絞り、ボウルに入れる。","酢、砂糖、塩を混ぜる。","きゅうりに加えて和え、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_036';
UPDATE recipes SET steps_json = '["市販の福神漬けを器に盛る。","そのまま完成。カレーの付け合わせに最適。"]', is_active = 1 WHERE recipe_id = 'side_037';
UPDATE recipes SET steps_json = '["市販のらっきょうを器に盛る。","そのまま完成。カレーの付け合わせに最適。"]', is_active = 1 WHERE recipe_id = 'side_038';
UPDATE recipes SET steps_json = '["厚揚げは一口大に切り、熱湯をかけて油抜きをする。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","厚揚げを加えて落し蓋をし、中火で15分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_039';
UPDATE recipes SET steps_json = '["がんもどきは熱湯をかけて油抜きをする。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","がんもどきを加えて落し蓋をし、中火で15分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_040';

-- 31-40
UPDATE recipes SET steps_json = '["油揚げは熱湯をかけて油抜きをし、細切りにする。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","油揚げを加えて中火で10分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_041';
UPDATE recipes SET steps_json = '["高野豆腐は水で戻し、一口大に切る。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","高野豆腐を加えて落し蓋をし、中火で15分煮る。","火を止めて味を染み込ませ、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_042';
UPDATE recipes SET steps_json = '["鍋に水を入れて沸騰させる。","卵を入れて10分茹でる。","冷水にとり、殻をむく。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_043';
UPDATE recipes SET steps_json = '["ゆで卵を作る。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","殻をむいたゆで卵を加え、弱火で10分煮る。","火を止めて冷まし、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_044';
UPDATE recipes SET steps_json = '["鍋に水を入れて70度に温める。","卵を入れて15分加熱する。","冷水にとり、殻を割る。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_045';
UPDATE recipes SET steps_json = '["ゆで卵を作り、細かく刻む。","ボウルにマヨネーズ、塩、こしょうを混ぜる。","ゆで卵を加えて和える。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_046';
UPDATE recipes SET steps_json = '["かぼちゃは一口大に切り、茹でる。","熱いうちにマッシュする。","マヨネーズ、塩、こしょうを混ぜる。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_047';
UPDATE recipes SET steps_json = '["じゃがいもは茹でて皮をむき、マッシュする。","バター、牛乳、塩、こしょうを加えて混ぜる。","なめらかになるまで混ぜる。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_048';
UPDATE recipes SET steps_json = '["じゃがいもは細切りにし、水にさらす。","水気を切り、170度の油で揚げる。","きつね色になったら取り出し、油を切る。","塩を振って完成。"]', is_active = 1 WHERE recipe_id = 'side_049';
UPDATE recipes SET steps_json = '["じゃがいもは薄切りにする。","耐熱皿にじゃがいもを並べ、生クリーム、チーズ、塩、こしょうをかける。","200度のオーブンで20分焼く。","焼き色がついたら完成。"]', is_active = 1 WHERE recipe_id = 'side_050';

-- 41-50
UPDATE recipes SET steps_json = '["レタス、トマト、きゅうりを一口大に切る。","器に盛り、ドレッシングをかける。","そのまま完成。"]', is_active = 1 WHERE recipe_id = 'side_051';
UPDATE recipes SET steps_json = '["海藻ミックスは水で戻す。","きゅうり、わかめを千切りにする。","ボウルに酢、醤油、ごま油を混ぜる。","海藻、野菜を加えて和え、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_052';
UPDATE recipes SET steps_json = '["豆腐は水切りし、一口大に切る。","レタス、トマト、きゅうりを一口大に切る。","器に野菜と豆腐を盛る。","ドレッシングをかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_053';
UPDATE recipes SET steps_json = '["アボカドは皮と種を取り、一口大に切る。","レタス、トマトを一口大に切る。","器に野菜とアボカドを盛る。","ドレッシングをかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_054';
UPDATE recipes SET steps_json = '["トマトは一口大に切る。","器に盛り、オリーブオイル、塩、こしょうをかける。","バジルを飾って完成。"]', is_active = 1 WHERE recipe_id = 'side_055';
UPDATE recipes SET steps_json = '["キャベツは千切りにする。","器に盛り、ドレッシングをかける。","そのまま完成。"]', is_active = 1 WHERE recipe_id = 'side_056';
UPDATE recipes SET steps_json = '["人参は千切りにする。","ボウルにオリーブオイル、レモン汁、塩を混ぜる。","人参を加えて和え、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_057';
UPDATE recipes SET steps_json = '["ブロッコリーは小房に分け、茹でる。","冷水にとり、水気を切る。","ボウルにマヨネーズ、酢、塩を混ぜる。","ブロッコリーを加えて和え、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_060';
UPDATE recipes SET steps_json = '["トマトとモッツァレラチーズを薄切りにする。","交互に並べ、バジルを飾る。","オリーブオイル、塩、こしょうをかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_061';
UPDATE recipes SET steps_json = '["レタス、トマト、ゆで卵、ツナを一口大に切る。","オリーブ、アンチョビを加える。","ドレッシングをかけ、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_062';

-- 51-60
UPDATE recipes SET steps_json = '["レタス、トマト、ゆで卵、アボカド、ベーコンを一口大に切る。","器に並べる。","ドレッシングをかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_063';
UPDATE recipes SET steps_json = '["タコは茹でて一口大に切る。セロリは薄切りにする。","ボウルにオリーブオイル、レモン汁、塩、こしょうを混ぜる。","タコとセロリを加えて和える。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_064';
UPDATE recipes SET steps_json = '["きのこ類は食べやすい大きさに切る。","フライパンで軽く炒める。","ボウルにオリーブオイル、酢、塩、こしょうを混ぜる。","きのこを加えて和え、冷蔵庫で30分冷やして完成。"]', is_active = 1 WHERE recipe_id = 'side_065';
UPDATE recipes SET steps_json = '["パプリカは縦に切り、グリルで焼く。","皮をむき、細切りにする。","ボウルにオリーブオイル、酢、塩、こしょうを混ぜる。","パプリカを加えて和え、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_066';
UPDATE recipes SET steps_json = '["ズッキーニは輪切りにする。","グリルまたはフライパンで両面を焼く。","塩、こしょう、オリーブオイルをかける。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_067';
UPDATE recipes SET steps_json = '["なすは輪切りにし、焼く。","ボウルにオリーブオイル、酢、にんにく、塩を混ぜる。","なすを加えて和え、冷蔵庫で30分冷やす。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_068';
UPDATE recipes SET steps_json = '["トマトの上部を切り、中をくり抜く。","くり抜いた中身にひき肉、玉ねぎ、パン粉を混ぜる。","トマトに詰め、オーブンで20分焼く。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_069';
UPDATE recipes SET steps_json = '["野菜は一口大に切る。","保存瓶に野菜を入れる。","酢、砂糖、塩、水を混ぜて沸騰させ、野菜にかける。","冷蔵庫で一晩寝かせて完成。"]', is_active = 1 WHERE recipe_id = 'side_070';
UPDATE recipes SET steps_json = '["れんこんは薄切りにして酢水にさらす。","フライパンにごま油を熱し、れんこんを炒める。","醤油、砂糖、みりんを加えて汁気がなくなるまで炒める。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_071';
UPDATE recipes SET steps_json = '["たけのこは一口大に切る。","鍋にだし、醤油、みりん、砂糖、かつお節を入れて煮立てる。","たけのこを加えて落し蓋をし、中火で15分煮る。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_072';

-- 61-70
UPDATE recipes SET steps_json = '["ふきは茹でて皮をむき、食べやすい長さに切る。","鍋にだし、醤油、みりん、砂糖を入れて煮立てる。","ふきを加えて落し蓋をし、中火で10分煮る。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_073';
UPDATE recipes SET steps_json = '["山菜は洗って水気を切る。","天ぷら粉を水で溶き、山菜をくぐらせる。","170度の油で揚げる。","器に盛り、塩を添えて完成。"]', is_active = 1 WHERE recipe_id = 'side_074';
UPDATE recipes SET steps_json = '["こごみは洗って一口大に切る。","沸騰したお湯で1分茹で、冷水にとる。","醤油とだしで和える。","器に盛り、かつお節をかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_075';
UPDATE recipes SET steps_json = '["ゼンマイは水で戻し、食べやすい長さに切る。","鍋に油を熱し、ゼンマイを炒める。","だし、醤油、砂糖、みりんを加えて煮る。","汁気が少なくなったら器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_076';
UPDATE recipes SET steps_json = '["わらびはアク抜きをし、食べやすい長さに切る。","沸騰したお湯で1分茹で、冷水にとる。","醤油とだしで和える。","器に盛り、かつお節をかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_077';
UPDATE recipes SET steps_json = '["菜の花は根元を切り落とす。","沸騰したお湯で1分茹で、冷水にとる。","醤油とだしで和える。","器に盛り、かつお節をかけて完成。"]', is_active = 1 WHERE recipe_id = 'side_078';
UPDATE recipes SET steps_json = '["セロリは斜め薄切りにする。","保存瓶にセロリを入れる。","酢、砂糖、塩、水を混ぜて沸騰させ、セロリにかける。","冷蔵庫で一晩寝かせて完成。"]', is_active = 1 WHERE recipe_id = 'side_079';
UPDATE recipes SET steps_json = '["ラディッシュは薄切りにする。","保存瓶にラディッシュを入れる。","酢、砂糖、塩、水を混ぜて沸騰させ、ラディッシュにかける。","冷蔵庫で一晩寝かせて完成。"]', is_active = 1 WHERE recipe_id = 'side_080';
UPDATE recipes SET steps_json = '["きゅうりは薄切りにし、塩もみをする。","水気を絞り、ボウルに入れる。","醤油、砂糖、酢、ごまを混ぜる。","きゅうりに加えて和え、器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_082';
UPDATE recipes SET steps_json = '["白菜は一口大に切る。","ボウルに白菜と塩昆布を入れて混ぜる。","10分置いて味をなじませる。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_083';

-- 71-77
UPDATE recipes SET steps_json = '["キャベツは一口大に切る。","ボウルにキャベツと塩昆布を入れて混ぜる。","10分置いて味をなじませる。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_084';
UPDATE recipes SET steps_json = '["もやしは洗って水気を切る。","ボウルにもやしと塩昆布を入れて混ぜる。","5分置いて味をなじませる。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_085';
UPDATE recipes SET steps_json = '["ゴーヤは縦半分に切り、種を取り薄切りにする。","豚肉、豆腐は一口大に切る。","フライパンで豚肉を炒め、ゴーヤ、豆腐を加える。","塩、こしょうで味付けし、卵を加えて炒めて完成。"]', is_active = 1 WHERE recipe_id = 'side_086';
UPDATE recipes SET steps_json = '["もやしは洗って水気を切る。","フライパンに油を熱し、もやしを強火で炒める。","塩、こしょうで味付けする。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_087';
UPDATE recipes SET steps_json = '["ピーマン、パプリカ、玉ねぎを細切りにする。","フライパンに油を熱し、野菜を炒める。","オイスターソース、醤油で味付けする。","器に盛って完成。"]', is_active = 1 WHERE recipe_id = 'side_088';
