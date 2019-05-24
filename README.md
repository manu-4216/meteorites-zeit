## Meteorites list

### 1. Description of the project

Create an application that provides users with the ability to explore meteorite strikes across the globe by searching the [Meteorite Landing dataset](https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh) on the Nasa Open Data Portal.

#### 1.1: Objectives:

**a. Focus on the backend**

Create a project with more a focus on the backend, since I'm already comfortable with the front-end side of things.

For this reason, I chose to take control over the database, and import the dataset into a Database that I manage.

The source database is not updated in real time (Data Last Updated: July 20, 2015), so it made sense to me to do so without having stall data.

**b. Use a fast hosting service**

I used Heroku in the past a lot. But because of the hybernation of the apps in the free tier, it would have looked very slow.

Because of this, I looked into alternatives. And I found [zeit](https://zeit.co/), a hosting service with a generous free tier.

### 2. Description of the technical stack

#### 2.1 Database: MongoDB Atlas

MongoDB Atlas has a free tier which can easily handle the meteorites dataset (around 45k entries).

I created a script that I used to import the dataset into the MongoDB Atlas:

`npm run import-data`.

It uses the `csv` file that I downloaded from [data.nasa.gov](https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh/data#Export), containing the dataset.

Once imported into a collection, I also created a text index for the 'name' attribute. This is supposed to improve the speed for 'word' queries.

#### 2.2 Hosting service: Zeit

> ZEIT Now is a cloud platform for serverless deployment. It enables developers to host websites and web services that deploy instantly, scale automatically, and require no supervision, all with minimal configuration.

I used zeit for:

- serving a vanilla JS frontend (see `index.html`)
- serving a node lambda endpoint (see `search.js`)

The configuration of zeit is defined inside `now.json`.

The lambda function connects to a remote db, and it uses `express` to handle the request.

#### 2.3 Backend: express, mongo client

zeit integrates easily with `express`.

For the mongo client, I chose to go with `mongo` instead of `mongoose`, even though it is a bit more low-level. This is because `mongoose` needs a schema to work, while I prefered to skip this step.

I also added validation for the search query parameters that are being sent by the user (see `db/utils/checkValidationError.js`). Rules that can be checked easily:

- search query larger than 15 caracters
- offset which is not a number

Other checks are being performed, but those cannot happen by user interaction, but only if the user manualy alters the data sent. One example is the the sort type selection, which only allows 2 values in the UI, but if you were to send other values, you would still get an error from the server.
