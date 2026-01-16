#!/bin/bash

# Array of recipe IDs to delete
RECIPES=(
  "side_028" "side_033" "side_045" 
  "soup_011" "soup_012" "soup_013" "soup_014" "soup_015"
  "soup_016" "soup_017" "soup_018" "soup_019" "soup_020"
  "soup_021" "soup_022" "soup_023" "soup_024" "soup_025"
  "soup_026" "soup_027" "soup_028" "soup_029" "soup_030"
  "soup_031" "soup_032" "soup_033" "soup_034"
)

echo "=== Starting deletion of ${#RECIPES[@]} generic recipes ==="

for recipe_id in "${RECIPES[@]}"; do
  echo "Deleting $recipe_id..."
  npx wrangler d1 execute aichef-production --remote --command="DELETE FROM recipe_ingredients WHERE recipe_id = '$recipe_id'; DELETE FROM recipes WHERE recipe_id = '$recipe_id';" 2>&1 | grep -E "success|ERROR" || echo "  Deleted $recipe_id"
  sleep 0.5  # Rate limiting
done

echo "=== Deletion complete! Checking results... ==="
npx wrangler d1 execute aichef-production --remote --command="SELECT role, COUNT(*) as count FROM recipes GROUP BY role ORDER BY role" 2>&1 | grep -A 20 "results"
