#!/usr/bin/env python3
"""
Recipe Ingredients ID Fix Script
Converts ing_* IDs to correct format (meat_*, fish_*, veg_*, etc.)
"""

import os
import re
import glob

# ID mapping dictionary - based on actual ingredients table
ID_MAPPING = {
    # Meats
    'ing_chicken': 'meat_chicken',
    'ing_pork': 'meat_pork',
    'ing_beef': 'meat_beef',
    'ing_ground_beef': 'meat_ground_beef',
    'ing_ground_pork': 'meat_ground_pork',
    'ing_ground_mix': 'meat_ground_mix',
    'ing_bacon': 'meat_bacon',
    'ing_ham': 'meat_ham',
    'ing_sausage': 'meat_sausage',
    
    # Fish
    'ing_salmon': 'fish_salmon',
    'ing_mackerel': 'fish_mackerel',
    'ing_yellowtail': 'fish_yellowtail',
    'ing_saury': 'fish_saury',
    'ing_horse_mackerel': 'fish_horse_mackerel',
    'ing_white_fish': 'fish_white',
    'ing_cod': 'fish_cod',
    'ing_tuna': 'fish_tuna',
    
    # Seafood
    'ing_shrimp': 'seafood_shrimp',
    'ing_squid': 'seafood_squid',
    'ing_clam': 'seafood_clam',
    'ing_shijimi': 'seafood_shijimi',
    
    # Vegetables
    'ing_onion': 'veg_onion',
    'ing_carrot': 'veg_carrot',
    'ing_potato': 'veg_potato',
    'ing_sweet_potato': 'veg_sweet_potato',
    'ing_cabbage': 'veg_cabbage',
    'ing_napa_cabbage': 'veg_napa_cabbage',
    'ing_lettuce': 'veg_lettuce',
    'ing_spinach': 'veg_spinach',
    'ing_komatsuna': 'veg_komatsuna',
    'ing_broccoli': 'veg_broccoli',
    'ing_cauliflower': 'veg_cauliflower',
    'ing_asparagus': 'veg_asparagus',
    'ing_green_bean': 'veg_green_bean',
    'ing_green_pepper': 'veg_green_pepper',
    'ing_red_pepper': 'veg_red_pepper',
    'ing_tomato': 'veg_tomato',
    'ing_cucumber': 'veg_cucumber',
    'ing_eggplant': 'veg_eggplant',
    'ing_daikon': 'veg_daikon',
    'ing_burdock': 'veg_burdock',
    'ing_lotus_root': 'veg_lotus_root',
    'ing_taro': 'veg_taro',
    'ing_pumpkin': 'veg_pumpkin',
    'ing_zucchini': 'veg_zucchini',
    'ing_corn': 'veg_corn',
    'ing_edamame': 'veg_edamame',
    'ing_moyashi': 'veg_moyashi',
    'ing_bean_sprout': 'veg_bean_sprout',
    'ing_mushroom': 'veg_mushroom',
    'ing_shiitake': 'veg_mushroom',
    'ing_enoki': 'veg_enoki',
    'ing_shimeji': 'veg_shimeji',
    'ing_maitake': 'veg_maitake',
    
    # Tofu & Beans
    'ing_tofu_silken': 'tofu_silken',
    'ing_tofu_firm': 'tofu_firm',
    'ing_tofu': 'tofu_firm',
    'ing_fried_tofu': 'tofu_fried',
    'ing_thick_fried_tofu': 'tofu_thick_fried',
    'ing_natto': 'soy_natto',
    'ing_okara': 'soy_okara',
    
    # Dairy & Eggs
    'ing_egg': 'egg',
    'ing_milk': 'milk',
    'ing_butter': 'butter',
    'ing_cheese': 'cheese',
    'ing_yogurt': 'yogurt',
    'ing_cream': 'cream',
    
    # Grains & Noodles
    'ing_rice': 'grain_rice',
    'ing_bread': 'grain_bread',
    'ing_flour': 'grain_flour',
    'ing_udon': 'noodle_udon',
    'ing_soba': 'noodle_soba',
    'ing_ramen': 'noodle_ramen',
    'ing_pasta': 'noodle_pasta',
    
    # Seasonings - CORRECTED PREFIX
    'ing_oil': 'seasoning_oil',
    'ing_salt': 'seasoning_salt',
    'ing_sugar': 'seasoning_sugar',
    'ing_soy_sauce': 'seasoning_soy_sauce',
    'ing_miso': 'seasoning_miso',
    'ing_mirin': 'seasoning_mirin',
    'ing_sake': 'seasoning_sake',
    'ing_vinegar': 'seasoning_vinegar',
    'ing_dashi': 'seasoning_dashi',
    'ing_mayo': 'seasoning_mayo',
    'ing_mayonnaise': 'seasoning_mayo',
    'ing_ketchup': 'seasoning_ketchup',
    
    # Seaweed
    'ing_wakame': 'seaweed_wakame',
    'ing_kombu': 'seaweed_kombu',
    'ing_nori': 'seaweed_nori',
    'ing_hijiki': 'seaweed_hijiki',
}

def fix_migration_file(filepath):
    """Fix ingredient IDs in a migration file"""
    print(f"Processing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Track changes
    changes = 0
    original_content = content
    
    # Replace each old ID with new ID
    for old_id, new_id in ID_MAPPING.items():
        pattern = f"'{old_id}'"
        replacement = f"'{new_id}'"
        if pattern in content:
            content = content.replace(pattern, replacement)
            changes += content.count(replacement) - original_content.count(replacement)
    
    # Write back if changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Fixed {changes} ingredient IDs")
        return changes
    else:
        print(f"  - No changes needed")
        return 0

def main():
    # Find all migration files
    migration_dir = 'migrations/generated'
    pattern = os.path.join(migration_dir, 'recipe_ingredients_batch_*.sql')
    files = sorted(glob.glob(pattern))
    
    if not files:
        print(f"No migration files found in {migration_dir}")
        return
    
    print(f"Found {len(files)} migration files to process\n")
    
    total_changes = 0
    for filepath in files:
        changes = fix_migration_file(filepath)
        total_changes += changes
    
    print(f"\n✅ Complete! Total changes: {total_changes}")
    print(f"📝 Modified {len(files)} files")

if __name__ == '__main__':
    main()
