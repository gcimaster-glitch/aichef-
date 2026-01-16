#!/usr/bin/env node

/**
 * レシピ重複検出スクリプト
 * 
 * 機能：
 * - タイトルの重複をチェック
 * - 類似度の高いレシピを検出
 * - CI/CDで自動実行可能
 */

const fs = require('fs');
const path = require('path');

// 重複チェック関数
function checkDuplicates(recipes) {
  const duplicates = [];
  const titleMap = new Map();
  
  recipes.forEach((recipe, index) => {
    const title = recipe.title.trim();
    
    if (titleMap.has(title)) {
      duplicates.push({
        title,
        recipe_ids: [titleMap.get(title).recipe_id, recipe.recipe_id],
        indices: [titleMap.get(title).index, index]
      });
    } else {
      titleMap.set(title, { recipe_id: recipe.recipe_id, index });
    }
  });
  
  return duplicates;
}

// 類似度計算（レーベンシュタイン距離）
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// 類似度チェック
function checkSimilar(recipes, threshold = 0.8) {
  const similar = [];
  
  for (let i = 0; i < recipes.length; i++) {
    for (let j = i + 1; j < recipes.length; j++) {
      const title1 = recipes[i].title.trim();
      const title2 = recipes[j].title.trim();
      
      const distance = levenshteinDistance(title1, title2);
      const maxLen = Math.max(title1.length, title2.length);
      const similarity = 1 - (distance / maxLen);
      
      if (similarity >= threshold) {
        similar.push({
          recipe_id_1: recipes[i].recipe_id,
          recipe_id_2: recipes[j].recipe_id,
          title_1: title1,
          title_2: title2,
          similarity: Math.round(similarity * 100)
        });
      }
    }
  }
  
  return similar;
}

// メイン処理
function main() {
  console.log('🔍 レシピ重複チェック開始...\n');
  
  // レシピJSONファイルを検索
  const scriptsDir = path.join(__dirname, '../scripts');
  const recipeFiles = fs.readdirSync(scriptsDir)
    .filter(f => f.endsWith('.json') && f.includes('recipe'));
  
  if (recipeFiles.length === 0) {
    console.log('✅ チェック対象のレシピファイルがありません');
    process.exit(0);
  }
  
  let totalRecipes = 0;
  let totalDuplicates = 0;
  let totalSimilar = 0;
  
  recipeFiles.forEach(file => {
    const filePath = path.join(scriptsDir, file);
    console.log(`📄 ファイル: ${file}`);
    
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const recipes = Array.isArray(data) ? data : data.recipes || [];
      
      totalRecipes += recipes.length;
      
      // 完全重複チェック
      const duplicates = checkDuplicates(recipes);
      if (duplicates.length > 0) {
        console.log(`  ❌ 重複タイトル: ${duplicates.length}件`);
        duplicates.forEach(dup => {
          console.log(`     - "${dup.title}" (${dup.recipe_ids.join(', ')})`);
        });
        totalDuplicates += duplicates.length;
      }
      
      // 類似度チェック
      const similar = checkSimilar(recipes, 0.85);
      if (similar.length > 0) {
        console.log(`  ⚠️  類似レシピ: ${similar.length}組`);
        similar.slice(0, 3).forEach(sim => {
          console.log(`     - "${sim.title_1}" ⇔ "${sim.title_2}" (類似度${sim.similarity}%)`);
        });
        totalSimilar += similar.length;
      }
      
      if (duplicates.length === 0 && similar.length === 0) {
        console.log(`  ✅ 重複なし`);
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}`);
    }
  });
  
  // 結果サマリー
  console.log('═══════════════════════════════════════');
  console.log('📊 チェック結果サマリー');
  console.log('═══════════════════════════════════════');
  console.log(`総レシピ数: ${totalRecipes}`);
  console.log(`重複タイトル: ${totalDuplicates}件`);
  console.log(`類似レシピ: ${totalSimilar}組`);
  console.log('═══════════════════════════════════════\n');
  
  // 重複があればエラー終了（CI用）
  if (totalDuplicates > 0) {
    console.error('❌ 重複タイトルが検出されました。修正してください。');
    process.exit(1);
  }
  
  if (totalSimilar > 5) {
    console.warn('⚠️  類似レシピが多数検出されました。確認を推奨します。');
    process.exit(1);
  }
  
  console.log('✅ 重複チェック完了！問題ありません。');
  process.exit(0);
}

// 実行
if (require.main === module) {
  main();
}

module.exports = { checkDuplicates, checkSimilar };
