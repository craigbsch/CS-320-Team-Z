Backend with both docker container for automated scraping and fastAPI API

Due to OS variations, we have found using Colima to be the easiest method for consistent functionality for MacOS users, as we are deploying to a Linux container

Namely
```
colima start --profile rosetta --cpu 2 --memory 6 --arch aarch64 --vm-type=vz --vz-rosetta 
docker buildx build --platform linux/amd64 -t docker-app .
```

For x86 OS's, can simply build through a Linux VM (building to amd64). For testing locally this is unecessary, as you can simply run the python script.


For running the api, simply pip install requirements and then uvicorn function_app:app --reload


The backend is deployed on Azure and not necessary to deploy locally to view the site, see react-front-end. 
If necessary, ask for the env files and they can be provided (dbInfoDocker.env in the root directory of docker-scraper and dbInfo.env in nutritionapi)



Our database structure is fairly simple. We have two different tables, one storing history of users and nutrtional information, and another with 2 weeks of meals. We had considered linking these together such that you can find the corresponding meal in the meal_info db (from nutrition_info), but due to the large variety of meals we decided to only store ~2 weeks of meals at a given time, while storing a user's total nutritional history, thus making it preferable to simply copy over the meal information. User accounts are not stored on our mySQL database but instead on Auth0's, which handles encryption as well as secure access for us. Authenticating through their servers, we ensure the user is valid and then are able to access their nutrition corresponding to their id. Attached are images of our database structure.
<img width="535" alt="image" src="https://github.com/craigbsch/CS-320-Team-Z/assets/56412242/a9797171-5928-41c7-b459-254c7a3dce84">
<img width="945" alt="image" src="https://github.com/craigbsch/CS-320-Team-Z/assets/56412242/5199d325-7b18-4cbe-a0c6-a8dc4e573743">
<img width="977" alt="image" src="https://github.com/craigbsch/CS-320-Team-Z/assets/56412242/cc1069fa-fc74-4d50-b8fa-e58ce839c574">
