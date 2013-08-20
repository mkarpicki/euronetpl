folder_name=$(basename $PWD)
target_path=$PWD\_target

rm -r $target_path
mkdir $target_path
cp -R $PWD/* $target_path

grep -o -P '\".*?\"' $target_path/application.js.php | grep -o -P '[a-zA-Z0-9\-./]+' | xargs cat > $target_path/application.js

java -jar $HOME/Closure-compiler/compiler.jar --js $target_path/application.js --js_output_file $target_path/application.min.js

cp $target_path/index.html $target_path/index.html.tmp
sed 's/application.js.php/application.min.js/g' $target_path/index.html.tmp > $target_path/index.html


rm $target_path/application.js
rm $target_path/index.html.tmp

exit 0

