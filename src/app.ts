interface IActivity {
    id?:string
    title:string,
    img:string,
    timestamp:string
}

function formatDate(date:Date) {
    // returns date formatted as yyyy-mm-dd
    const year = date.getFullYear().toString()
    let month = date.getMonth().toString()
    month = +month > 9 ? month : '0'+ month
    let day = date.getDate().toString()
    day = +day > 9 ? day : '0' + day
    return `${year}-${month}-${day}`
}

class Activity{
    async render(activity:IActivity){
        let imgSrc = activity.img ? activity.img : 'assets/No-Image-Placeholder.svg.png'
        let activityDate = new Date(activity.timestamp)
        const milliseconds = Math.abs(activityDate.getTime() - (new Date()).getTime());
        const days = Math.round(milliseconds / 1000 / 60 / 60 / 24);

        let html = `
                <div class="app-activity" id="${activity.id}">
                    <h3 class="activity-title">${activity.title}</h3>
                    <div class="activity-image-div"><img src="${imgSrc}" alt="no image placeholder" class="activity-image"></div>
                    <div class="activity-details">
                        <div class="activity-timestamp">
                            <div class="activity-timestamp-date">Last done: ${formatDate(activityDate)}</div>
                            <div class="activity-timestamp-days">${days} days ago</div>
                        </div>
                    </div>
                    <div class="activity-actions">
                        <div class="check-activity-div">
                            <div>done today?</div>
                            <ion-icon name="checkmark-done-circle" size="large" onClick="new Activity().updateActivity({id:${activity.id}, timestamp: (new Date()).toString()})"></ion-icon>
                        </div>
                        <button class="activity-update" onClick="new Activity().fillActivityForm(${activity.id})">Update</button>
                        <button class="activity-delete" onClick="new Activity().deleteActivity(${activity.id})">Delete</button>
                    </div>
                </div>
        `

        return html

    }

    async addActivity(activity:IActivity){
        console.log(activity);

        console.log(JSON.stringify(activity));
        
        
        await fetch(`http://localhost:3000/activities`,
                    {
                        method:'POST',
                        body:JSON.stringify(activity),
                        headers:{
                            "Content-Type": "application/json"
                        }
                    })

                }
    async deleteActivity(id:string){
        await fetch(`http://localhost:3000/activities/${id}`, {
            method:'DELETE',
            headers:{
                "Content-Type": "application/json"
            }
        })
    }

    async updateActivity(activity:Partial<IActivity>) {
        await fetch(`http://localhost:3000/activities/${activity.id}`, {
            method:'PATCH',
            body:JSON.stringify(activity),
            headers:{
                "Content-Type": "application/json"
            }
        })
    }

    async fillActivityForm(activityId:string) {
        document.getElementById('add-streak')!.innerHTML = 'UPDATE STREAK'
        let activity:IActivity = await this.fetchActivity(activityId)
        let title = document.getElementById('new-activity-title') as HTMLInputElement
        let id = document.getElementById('new-activity-id') as HTMLInputElement
        let date = document.getElementById('new-activity-date') as HTMLInputElement
        title.value = activity.title
        id.value = activity.id ? activity.id : ""
        date.value = formatDate(new Date(activity.timestamp))

    }

    async fetchActivity(activityId:string){
        let response = await fetch(`http://localhost:3000/activities/${activityId}`)
        return await response.json()
    }
}

class Activities{
    async render(){
        let appElement = document.getElementById('app')!
        let activities = await this.fetchActivities()
        await activities.map(async (activity:IActivity) => {
            let activityHTML = await new Activity().render(activity)
            appElement.innerHTML += activityHTML
        })

    }

    async fetchActivities(){
        let response = await fetch(`http://localhost:3000/activities`)
        return await response.json()
    }
}

class App{
    static async render() {
        await new Activities().render()
    }
}

let addStreakForm = document.getElementById('add-streak-form') as HTMLFormElement
addStreakForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    let newActivityTitle = document.getElementById('new-activity-title') as HTMLInputElement
    let newActivityDate = document.getElementById('new-activity-date') as HTMLInputElement
    let activityId = document.getElementById('new-activity-id') as HTMLInputElement

    let activity:IActivity = {
        title: newActivityTitle.value,
        img: "",
        timestamp: (new Date(newActivityDate.value)).toString()
    }
    if (document.getElementById('add-streak')!.innerHTML == 'ADD STREAK') {
        new Activity().addActivity(activity)
    } else {
        activity.id = activityId.value
        new Activity().updateActivity(activity)
    }
    
})


let dateInput = document.getElementById('new-activity-date') as HTMLInputElement
dateInput.addEventListener('change', ()=> {
    console.log(dateInput.value);
    console.log(new Date(dateInput.value));
    
    
})


App.render()