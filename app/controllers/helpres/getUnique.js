import {
    createCounties,
    createCenters, createStudents,
    createSchools,
    createStates, createTypes,
} from "../Result.server.js";

export default class GetUnique {

    // data get from file
    results = []
    states = []
    counties = []
    schools = []
    centers = []
    types = []

    yearId = 0
    typeId = 0
    sessionId = 0
    slug = 0
    resultId = 0

    allIsReady = false
    stateIsReady = false
    countyIsReady = false
    schoolIsReady = false
    centerIsReady = false
    typeIsReady = false
    studentIsReady = false

    students = []

    constructor({results, states, counties, schools, centers, types, yearId, typeId, sessionId, slug, resultId}) {
        this.results = results
        this.states = states
        this.counties = counties
        this.schools = schools
        this.centers = centers
        this.types = types
        this.yearId = yearId
        this.typeId = typeId
        this.sessionId = sessionId
        this.slug = slug
        this.resultId = resultId
    }

    async processor(){
        await this.createStates()
        if(
            this.stateIsReady &&
            this.countyIsReady &&
            this.schoolIsReady &&
            this.centerIsReady &&
            this.studentIsReady
        ){
            this.allIsReady = true
        }

    }


    async createStates (){
        console.log("i am at states")
        if(this.states && this.states.length > 0){
            const res  = await createStates(this.states)
            if(res){
                this.stateIsReady = true
                await this.createCounties()
            }
        } else {
            this.stateIsReady = true
            await this.createCounties()
        }

    }

    async createCounties (){
        console.log("i am at counties")
        if(this.stateIsReady){
            if(this.counties && this.counties.length > 0){
                const res  = await createCounties(this.counties)
                if(res){
                    this.countyIsReady = true
                    await this.createSchools()
                }
            } else {
                this.countyIsReady = true
                await this.createSchools()
            }
        }
    }

    async createSchools (){
        console.log("i am at schools")
        if(this.countyIsReady){
            if(this.schools && this.schools.length > 0){
                const res  = await createSchools(this.schools)
                if(res){
                    this.schoolIsReady = true
                    await this.createCenters()
                }
            } else {
                this.schoolIsReady = true
                await this.createCenters()
            }
        }
    }

    async createCenters (){
        console.log("i am at centers")
        if(this.schoolIsReady){
            if(this.centers && this.centers.length > 0){
                const res  = await createCenters(this.centers)
                if(res){
                    this.centerIsReady = true
                    if(this.slug === 5){
                        await this.createTypes()
                    } else {
                        await this.createStudents()
                    }
                }
            } else {
                this.centerIsReady = true
                if(this.slug === 5){
                    await this.createTypes()
                } else {
                    await this.createStudents()
                }
            }
        }
    }

    async createTypes (){
        if(this.centerIsReady){
            if(this.types && this.types.length > 0){
                const res  = await createTypes(this.types)
                if(res){
                    this.typeIsReady = true
                    await this.createStudents()
                }
            } else {
                this.typeIsReady = true
                await this.createStudents()
            }

        }
    }

    getBirth(birth) {
        if(birth){
            if(this.slug === 1){
                const newBirth = `${birth.toString().trim()}-01-01`
                return new Date(newBirth)
            }
            return birth
        }
        return null
    }
    async createStudents (){
        switch (this.slug) {
            case 5:
                if(this.typeIsReady){
                    let number = 0
                    const chunkSize = this.results.length / 10
                    for (let start = 0; start < this.results.length; start += chunkSize) {
                        const chunk = this.results.slice(start, start + chunkSize + 1)
                        const res  = await createStudents({
                            students: chunk,
                            sessionId: this.sessionId,
                            typeId: this.typeId,
                            yearId: this.yearId,
                            resultId: this.resultId,
                            slug: this.slug
                        })
                        if(res){
                            console.log("i am at:", number)
                            number += 1
                        }
                    }
                    if(number === 10){
                        this.studentIsReady = true
                    }
                }
                break
            default:
                if(this.centerIsReady){
                    let number = 0
                    const chunkSize = this.results.length / 10
                    for (let start = 0; start < this.results.length; start += chunkSize) {
                        const chunk = this.results.slice(start, start + chunkSize + 1)
                        const res  = await createStudents({
                            students: chunk,
                            typeId: this.typeId,
                            yearId: this.yearId,
                            resultId: this.resultId,
                            slug: this.slug
                        })
                        if(res){
                            console.log("i am at:", number)
                            number += 1
                        }
                    }
                    if(number === 10){
                        this.studentIsReady = true
                    }
                }
        }
    }
}