Backend with both docker container for automated scraping and fastAPI API

Due to OS variations, we have found using Colima to be the easiest method for consistent functionality for MacOS users, as we are deploying to a Linux container

Namely
```
colima start --profile rosetta --cpu 2 --memory 6 --arch aarch64 --vm-type=vz --vz-rosetta 
docker buildx build --platform linux/amd64 -t docker-app .
```

For x86 OS's, can simply build through a Linux VM (building to amd64).


For running the api, simply pip install requirements and then uvicorn function_app:app --reload
