# Backend flow when a project will be created.

## Create a project:

to create a project, the frontend needs to send an object with 3 keys: title, description, and authorship, all of them "type of String".

```bash
{
    title: "String",
    description: "String",
    authorship: "String"
}

```

Method: POST,<br />
Route:

```bash
'/projects'
```

## Fill the jobList array

Once the project is created, the user will proceed to add a required job in the jobList array in the project document, ( job offers ).<br />
The frontend needs to send an Object with 2 keys, job (value will be id of the job) and description of the required job. <br />
If everything goes well, an object will be created in the jobList array with its own "\_id".

```bash
{
    job: "id of job in Data Base",
    description: "Description of the required job"
}
```

Method: PUT,<br />
Route:

```bash
'/projects/ownProjects/:id'
```

## Update and delete items in the jobList array.

Once a job has been created in the jobList array, we can provide the possibility to the user to update the description or delete whole job from the jobList array.

### Update

to update description or job, you need to send as params: project id and id of the item to be updated in the jobList ( jobListId ).

Method: PUT<br />
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

Route:

params: ownProject id (:id) and jobListId (:jobListId)

```bash
'/projects/ownProjects/:id/jobList/:jobListId'
```
