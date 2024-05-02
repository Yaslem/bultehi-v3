export default class ParseHTML {

    body = document.createElement("div")
    constructor(body) {
        this.#setStyles()
        Array.from(body.body.children).forEach((node) => {
            node.style.lineHeight = "1.8";
            const classesAll = "text-sm font-medium text-slate-700 text-justify leading-8";
            node.classList.add(...classesAll.split(" "))
            switch (node.tagName) {
                case "BLOCKQUOTE":
                    this.#Blockquote(node)
                    break
                case "TABLE":
                    this.#Table(node)
                    break
                case "P":
                    this.#Image(node)
                    break
                case "UL":
                    this.#Ul(node)
                    break
                default:
                    this.#All(node)
            }

        })
    }

    #setStyles(){
        const classes = "flex flex-col gap-2";
        this.body.classList.add(...classes.split(" "))
    }

    #Image(p) {
        Array.from(p.children).forEach(node => {
            const classes = "border rounded-lg w-full h-auto";
            if (node.tagName === "IMG"){
                node.classList.add(...classes.split(" "))
            }
        })
        return this.body.append(p)
    }

    #All(nodes) {
        return this.body.append(nodes)

    }

    #Ul(list){
        const classes = "list-disc list-inside";
        list.classList.add(...classes.split(" "))
        return this.body.append(list)
    }

    #Blockquote(blockquote){
        const classes = "bg-stone-50 border-r-2 p-2 rounded-lg";
        blockquote.classList.add(...classes.split(" "))
        return this.body.append(blockquote)
    }

    #Table(table){
        const div = document.createElement("div")

        const classesDiv = "border border-dashed rounded-lg overflow-hidden";
        const classesTable = "w-full border-collapse";
        table.classList.add(...classesTable.split(" "))
        Array.from(table.children).forEach(nodeTable => {
            if (nodeTable.tagName === "THEAD"){
                if (nodeTable.hasChildNodes()){
                    Array.from(nodeTable.children).forEach(nodeTableTR => {
                        if (nodeTableTR.tagName === "TR"){
                            Array.from(nodeTableTR.children).forEach(nodeTableTH => {
                                const classes = "p-3 bg-white text-indigo-700 border-b border-dashed border-r-0 text-sm font-medium text-center";
                                nodeTableTH.classList.add(...classes.split(" "))
                            })
                        }
                    })
                }
            }
            if (nodeTable.tagName === "TBODY") {
                if (nodeTable.hasChildNodes()){
                    Array.from(nodeTable.children).forEach(nodeTableTR => {
                        if (nodeTableTR.tagName === "TR"){
                            const classes = "p-2 even:bg-stone-50 text-xs text-gray-700 font-medium";
                            nodeTableTR.classList.add(...classes.split(" "))

                            Array.from(nodeTableTR.children).forEach(nodeTableTD => {
                                const classes = "p-2 text-center";
                                nodeTableTD.classList.add(...classes.split(" "))
                            })
                        }
                    })
                }
            }
        })

        div.classList.add(...classesDiv.split(" "))
        div.appendChild(table)
        return this.body.append(div)
    }

    render() {
        return this.body
    }
}