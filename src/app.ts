interface IActivity {
    title:string,
    img:string,
    timestamp:Date
}

class Activity{
    async render(){

    }

    async addActivity(){

    }

    async deleteActivity(){

    }

    async fetchActivity(){

    }
}

class Activities{
    async render(){

    }
}

class App{
    static async render() {
        await new Activities().render()
    }
}