# use

In the repository where you want to use it, create a workflow in `.github/workflows/assign-reviewers.yml`

```yml

name: Assign Reviewers Action

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: tu-usuario/my-github-action@v1
        with:
          name: "ChatGPT"

```