#!/bin/bash

# Replace hardcoded yellow colors with theme colors in wedding components
find src/components/wedding -name "*.tsx" -exec sed -i 's/yellow-600/gold/g' {} \;
find src/components/wedding -name "*.tsx" -exec sed -i 's/yellow-800/accent/g' {} \;

# Replace other common hardcoded colors
find src/components/wedding -name "*.tsx" -exec sed -i 's/text-blue-600/text-primary/g' {} \;
find src/components/wedding -name "*.tsx" -exec sed -i 's/text-blue-800/text-darkprimary/g' {} \;
find src/components/wedding -name "*.tsx" -exec sed -i 's/bg-blue-50/bg-primarylight/g' {} \;
find src/components/wedding -name "*.tsx" -exec sed -i 's/bg-blue-100/bg-primarylight/g' {} \;

# Replace form components
find src/components/forms -name "*.tsx" -exec sed -i 's/yellow-600/gold/g' {} \;
find src/components/forms -name "*.tsx" -exec sed -i 's/yellow-800/accent/g' {} \;

# Replace interactive components  
find src/components/interactive -name "*.tsx" -exec sed -i 's/yellow-600/gold/g' {} \;
find src/components/interactive -name "*.tsx" -exec sed -i 's/yellow-800/accent/g' {} \;

echo "Fixed hardcoded colors in wedding components!"