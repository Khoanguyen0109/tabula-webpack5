read -p 'Version: ' version
read -p 'Tag note message: ' tag_note

git checkout production
git pull
git pull origin staging
commit_message="DEPLOY VERSION v$version"
sed -i '' "150s|\(.*\)|\t\t\t\t  <div >Version $version</div>|" `pwd`/src/shared/Auth/components/Layout.js
git add .
git commit -m "$commit_message"
git push

git tag -a v"$version" -m "$tag_note"
git push origin --tags
rm -rf node_modules
npm install
NODE_ENV=production npm run build