# Backend flow when a project will be created.

## Create a project:

to create a project, the frontend needs to send an object with 3 keys: title, description, and authorship, all of them "type of String".

Method: POST,<br />
Route:

```bash
'/projects'
```

Body:

```bash
{
    title: "String",
    description: "String",
    authorship: "String"
}

```

## Fill the jobList array

Once the project is created, the user will proceed to add a required job in the jobList array in the project document, ( job offers ).<br />
The frontend needs to send an Object with 2 keys, job (value will be id of the job) and description of the required job. <br />
If everything goes well, an object will be created in the jobList array with its own "\_id".

Method: PUT,<br />
Route:

```bash
'/projects/ownProjects/:id'
```

Body:

```bash
{
    job: "id of job in Data Base",
    jobDescription: "Description of the required job"
}
```

## Update and delete items in the jobList array.

Once a job has been created in the jobList array, we can provide the possibility to the user to update the description or delete whole job from the jobList array.

### Update

to update description or job, you need to send as params: project id and id of the item to be updated in the jobList ( jobListId ).

Method: PUT<br />
params: ownProject id (:id) and jobListId (:jobListId)<br />
Route:

```bash
'/projects/ownProjects/:id/jobList/:jobListId'
```

Body:

```bash
{
    description: "...other description"
}
```

or

```bash
{
    job: "...other job id"
}
```

or

```bash
{
    job: "...other job id",
    description: "...other description"
}
```

### Delete

To delete an Item in the jobList array, we will call the same route, but this time will be a Delete request.

Method: DELETE<br />
params: ownProject id (:id) and jobListId (:jobListId)<br />
Route:

```bash
'/projects/ownProjects/:id/jobList/:jobListId'
```

## Adding a participant to fill a job position in the project.

once our project's owner, ( project manager ), get requests from other users to be part in the project, our owner will be able to add a "participant" to fill the required job with one of the aspirants applying for the project.

Let's check how it works:

Method: PUT

params: ownProject id (:id), jobListId (:jobListId) and participant id (:participantId)

Route:

```bash
'/projects/ownProjects/:id/jobList/:jobListId/participant/:participantId'
```

## Deleteing the participant from the jobList.

If our project owner decides ( project manager ) decides to a user out of the project but leaving the space available for another user, the owner will have a route to fire someone 😬.
We will call the same route in this case.

Method: DELETE

params: ownProject id (:id), jobListId (:jobListId) and participant id (:participantId)

Route:

```bash
'/projects/ownProjects/:id/jobList/:jobListId/participant/:participantId'
```

That's it for now, Happy Coding! 😉
