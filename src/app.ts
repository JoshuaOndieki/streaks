interface IActivity {
    id?:string
    title:string,
    img:string,
    timestamp:string
}

class Activity{
    async render(activity:IActivity){
        let imgSrc = activity.img ? activity.img : 'assets/No-Image-Placeholder.svg.png'
        // let date:Date = new Date()
        // let diffInMilliseconds = Math.abs(date - Date.parse(activity.timestamp));
        // let diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24));
        let activityDate = new Date(activity.timestamp)
        const milliseconds = Math.abs(activityDate.getTime() - (new Date()).getTime());
        
        const days = Math.round(milliseconds / 1000 / 60 / 60 / 24);
        let html = `
                <div class="app-activity">
                    <h3 class="activity-title">${activity.title}</h3>
                    <div class="activity-image-div"><img src="${imgSrc}" alt="no image placeholder" class="activity-image"></div>
                    <div class="activity-details">
                        <div class="activity-timestamp">
                            <div class="activity-timestamp-date">Last done: ${activity.timestamp}</div>
                            <div class="activity-timestamp-days">${days} days ago</div>
                        </div>
                    </div>
                    <div class="activity-actions">
                        <div class="check-activity-div">
                            <div>done today?</div>
                            <ion-icon name="checkmark-done-circle" size="large" onClick="new Activity().updateActivity(${activity.id})"></ion-icon>
                            </div>
                        <button class="activity-delete" onClick="new Activity().deleteActivity(${activity.id})">Delete Activity</button>
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

    async updateActivity(id:string) {
        await fetch(`http://localhost:3000/activities/${id}`, {
            method:'PATCH',
            body:JSON.stringify({timestamp: (new Date).toString()}),
            headers:{
                "Content-Type": "application/json"
            }
        })
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
    // let date = new Date();
    
    // let day = date.getDate().toString();    
    // let month = (date.getMonth() + 1).toString();    
    // let year = date.getFullYear();    
    
    let activity:IActivity = {
        title: newActivityTitle.value,
        img: "",
        timestamp: newActivityDate.value
    }
    new Activity().addActivity(activity)
})


let dateInput = document.getElementById('new-activity-date') as HTMLInputElement

console.log(dateInput.value);

dateInput.addEventListener('change', ()=> {
    console.log(dateInput.value);
    console.log(new Date(dateInput.value));
    
    
})


App.render()