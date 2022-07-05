import { UserGithub } from "./githubUser.js";

// Class de controle da lógica e estruturação dos dados.

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);

    this.load();
    this.update();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error("Usuário Já cadastrado");
      }

      const user = await GithubUsers.search(username);

      if (user.login === undefined) {
        throw new Error("Usuários não encontrado!");
      }
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;

    this.update();
    this.save();
  }
}

// Class de inclusão e visualização de eventos HTML

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");

    this.update();

    this.onAdd();
    this.update();
  }

  onAdd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
    };
  }

  update() {
    this.removeAllTer();
    this.entries.forEach((user) => {
      const row = this.createRow();
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    const userContent = `
              <td class="user">
                <img src="http://github.com/danilosb91.png" alt="">
                <a href="http://github.com/danilosb91" target="_black">
                <p>Danilo Barão</p>
                <span>/DaniloSB91</span>

                </a>
            </td>
          <td class="repositories">15</td>
          <td class="followers">10</td>
          <td class="delete">Remover</td>
          `;
    tr.innerHTML = userContent;

    return tr;
  }

  removeAllTer() {
    console.log(this.tbody.querySelectorAll("tr")).forEach((tr) => {
      tr.remove();
    });
  }
}
