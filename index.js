/*chamando o inquirer */
const { select, input, checkbox } = require('@inquirer/prompts');
const fs = require("fs").promises

let mensagem = "Bem vindo ao APP de Metas";

const carregarMetas = async () => {

    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas =  JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

// cadastrando meta e verificando com length se há + de 1 caracter
const  cadastrarMeta = async () =>{
    const meta = await input({message: "Digite a meta:"})

    if(meta.length == 0){
        mensagem = "A meta não pode ser vazia.";
        return
    }

    metas.push(
        { 
            value: meta, 
            checked: false
        }
    )

    mensagem = "Meta cadastrada com sucesso!"
}

//Listando as metas
const  listarMetas = async () =>{
    if(metas.length == 0){
        mensagem = "Não existem metas :)"
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o Espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => { // percorrendo as metas
        m.checked = false // deixando elas falsas para que não haja erro
    })


    if(respostas.length == 0){
        mensagem = "Nenhuma meta selecionada";
        return
    }

  
// percorrendo as metas com foreach
    respostas.forEach((resposta) =>{
        const meta = metas.find((m) => { // procurando metas
            return m.value == resposta // verifcando se a meta e o valor são os mesmos. Ex: meta = andar é igual a value: andar?
        })

        meta.checked = true //colocando como verdadeiro a comparação anterior
    }) 

    mensagem = "Meta(s) marcadas como concluída(s)";
  
}

const metasRealizadas = async () => {
    if(metas.length == 0){
        mensagem = "Não existem metas :("
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        mensagem = "Não existem metas realizadas :(";
        return
    }
    
    await select({
        message: "Metas Realizadas:",
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    if(metas.length == 0){
        mensagem = "Não existem metas :("
        return
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length ==0) {
        mensagem = "Não existem metas abertas :)";
        return
    }

    await select({
        message: "Metas Abertas:" + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    if(metas.length == 0){
        mensagem = "Não existem metas :("
        return
    }

    const metasDesmarcadas = metas.map((meta) =>{
        return {value:meta.value, checked: false}
    })

    const intensDeletar = await checkbox({
        message: "Use as setas para mudar de meta, o Espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(intensDeletar.length == 0){
        mensagem = "Nenhum item para deletar";
        return
    }

    intensDeletar.forEach((item) =>{
      metas =  metas.filter((meta) =>{
        return meta.value != item
      })
    })

    mensagem = "Meta(s) deleta(s) com sucesso!";
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != ""){
        console.log(mensagem);
        console.log("");
        mensagem = "" 
    }
}

/*estrutura do menu*/
const start = async() =>{

    await carregarMetas()

    while(true){

        mostrarMensagem()

     await  salvarMetas()

     const opcao = await select({
        message: "Menu >",
        choices: [
            {
                name: "Cadastrar meta",
                value:"cadastrar"
            },

            {
                name: "Listar metas",
                value:"listar"
            },

            {
                name: "Metas realizadas",
                value:"realizadas"
            },

            {
                name: "Metas abertas",
                value:"abertas"
            },

            {
                name: "Deletar metas",
                value:"deletar"
            },

            {
                name:"Sair",
                value: "sair"
            }
        ]
     })

       switch(opcao){

            case "cadastrar":
                await cadastrarMeta()
                break;

            case "listar":
                await listarMetas()
                break;

            case "realizadas":
                await metasRealizadas()
                break;

            case "abertas":
                await metasAbertas()
                break;

             case "deletar":
                await deletarMetas()
                break;

            case "sair":
                console.log("Até a próxima!");
                return   // return encerra o while 
       }
    }
}

start()