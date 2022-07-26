read -p 'Version: ' version
git checkout new-ui
git pull
git pull origin staging
sed -i '' "158s|\(.*\)|\t\t\t\t  <div >Version $version</div>|" `pwd`/src/shared/Auth/components/Layout.js
commit_message="DEPLOY VERSION v$version"
git add .
git commit -m "$commit_message"
git push 
git checkout staging
git pull 
git pull origin new-ui
git push
