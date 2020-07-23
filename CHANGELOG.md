## [1.2.3](https://github.com/olets/genealogit/compare/v1.2.2...v1.2.3) (2020-07-23)

Lodash vulnerability fix by Dependabot

## [1.2.2](https://github.com/olets/genealogit/compare/v1.2.1...v1.2.2) (2020-06-07)

Hotfix to temove autocompletion oclif plugin + update docs.

## [1.2.1](https://github.com/olets/genealogit/compare/v1.2.0...v1.2.1) (2020-06-07)

Documentation hotfix.

# [1.2.0](https://github.com/olets/genealogit/compare/v1.1.1...v1.2.0) (2020-06-07)


### Features

* **build:** account for the possibility that parents is empty array ([8e5acb9](https://github.com/olets/genealogit/commit/8e5acb9882fb34bf45521bb1d7440a44b352ed6e))



## [1.1.1](https://github.com/olets/genealogit/compare/v1.1.0...v1.1.1) (2020-06-01)



# [1.1.0](https://github.com/olets/genealogit/compare/v1.0.1...v1.1.0) (2020-06-01)


### Bug Fixes

* **commands:** paths work when package is installed ([0d1a9a5](https://github.com/olets/genealogit/commit/0d1a9a55ae037ac68814d2a589914f6e9059a3a1))
* **relationship:** more reliable result ([4f8fbd6](https://github.com/olets/genealogit/commit/4f8fbd6721735b58cac7d9f8457298617425123b))


### Features

* **branches:** prefix with file name... ([50008be](https://github.com/olets/genealogit/commit/50008befa7ed7b1ad9ac5a640ae95a2ae83952ad))
* **build:** add verbose option, default to progress bars ([39c9518](https://github.com/olets/genealogit/commit/39c9518344ee59ab04a1d7d36cf87972d886781e))
* **build:** handle unsupported format gracefully ([1d7018a](https://github.com/olets/genealogit/commit/1d7018ada19d7e2b8525aad6591b5946c36a1445))
* **build:** support format option without file option ([352ae3b](https://github.com/olets/genealogit/commit/352ae3be5ad21578b35f3ea8c455e9eefca62c0d))
* **build:** support simple 'parentIds' format ([a0581ed](https://github.com/olets/genealogit/commit/a0581edf3bb10989c97fafb6547ba0caff8201b7))
* **clean:** add command ([1c5da69](https://github.com/olets/genealogit/commit/1c5da6979c1ba51654b11a8d44b4188aa28eafb5))
* **cli:** autocompletion ([700d5a4](https://github.com/olets/genealogit/commit/700d5a4becf31cc53f874b88f5e32c4bdb14ce02))
* **connect:** try using git-filter-repo to harden replacements ([d9b7c8d](https://github.com/olets/genealogit/commit/d9b7c8dc06fdf2f6f49f7000218274810abbf11b))
* **oclif:** add update host ([f1eadeb](https://github.com/olets/genealogit/commit/f1eadeb9b0f887fb5d03a1ccd974b6653aa64302))
* **relationship:** abort if either individual does not exist ([fc2970e](https://github.com/olets/genealogit/commit/fc2970e641183af0eb5c7507f858b0540eb133f6))
* **relationship:** result includes names ([623fb46](https://github.com/olets/genealogit/commit/623fb46bbe1a090311e670a766dd140fd692a34a))



## [1.0.1](https://github.com/olets/genealogit/compare/v1.0.0...v1.0.1) (2020-06-01)


### Bug Fixes

* **packaging:** resolve 'prepack' and 'oclif-dev pack' errors... ([33cc741](https://github.com/olets/genealogit/commit/33cc741d688a0b3534dd770a244d8a0f89de058e))


### Features

* **visualize:** drop support for zooming in ([dbc02da](https://github.com/olets/genealogit/commit/dbc02dac3223085a95f954ca9d2f64df3b7c5223))



# [1.0.0](https://github.com/olets/genealogit/compare/9e932cf503dc1571fe2609101be0298786571fd7...v1.0.0) (2020-06-01)


### Features

* **app:** npm init, add gedcom-js dependency ([4bcb50a](https://github.com/olets/genealogit/commit/4bcb50af73eed97f6a1571a8c7ddf2675698edc5))
* **app:** parse parser's demo file ([ca3881f](https://github.com/olets/genealogit/commit/ca3881f13399eb8a3ce0e8294bdbc39cb780e61e))
* **build:** support input file argument ([ff2330e](https://github.com/olets/genealogit/commit/ff2330ee18c6ea98db537d48d253c7b735b0d383))
* **build:** support json, yaml ([39b8f4e](https://github.com/olets/genealogit/commit/39b8f4e7bab905b83992bbabaa339202ae0c4bd2))
* **clean:** delete replacement objects ([5fd3943](https://github.com/olets/genealogit/commit/5fd39435ae93c0be77fcf8b3340f0fd339dd4c48))
* **clean:** run before create ([d764811](https://github.com/olets/genealogit/commit/d764811239a322fae4598151980ccb54a11d760e))
* **cli:** add build command ([00263de](https://github.com/olets/genealogit/commit/00263deaad37ecdca8bb9b45975d9683d16b9d6a))
* **commit:** include full record in commit message ([c3a28bd](https://github.com/olets/genealogit/commit/c3a28bd906180ec4d791980066762dd7d97bf822))
* **commits:** authored by Genealogit ([122709c](https://github.com/olets/genealogit/commit/122709c9b814dfea70230bf9a9511f50bba09599))
* **connect:** add to node app ([97060e1](https://github.com/olets/genealogit/commit/97060e1eaf8c7c8c231e461763486dd2e0e99921))
* **creat:** execSync to create in a loop ([e281709](https://github.com/olets/genealogit/commit/e2817093aeb8f98c8dec52ece83b05e37a177323))
* **create:** include id in commit message ([ad4dc5c](https://github.com/olets/genealogit/commit/ad4dc5c8d24bd8a34633cd32c329046482bd44ac))
* **create:** run script ([3dea8d9](https://github.com/olets/genealogit/commit/3dea8d9800da0e38b588e1e4bd862188615206ee))
* **create, build:** bash script ([9e932cf](https://github.com/olets/genealogit/commit/9e932cf503dc1571fe2609101be0298786571fd7))
* **create, connect:** support missing names ([500f895](https://github.com/olets/genealogit/commit/500f895f6bc0cad38b9848be689a0e25e826f7d5))
* **files:** support all files in pwd ([197f395](https://github.com/olets/genealogit/commit/197f39510579c9455d8fa2e74b98676f60f650f2))
* **logging:** add messages for creation and connection ([95fca38](https://github.com/olets/genealogit/commit/95fca3828fda15fac7a4586e44e1548f526497b6))
* **parser:** map parsed input to the needed data ([bd24994](https://github.com/olets/genealogit/commit/bd249945eb392db321328e8495fa8eff2f805719))
* **parser:** return id, full name, and array of parent ids ([a2e3ab7](https://github.com/olets/genealogit/commit/a2e3ab74245703dc3de8713fa43774cd664a2d9e))
* **relationship:** add command ([28d3391](https://github.com/olets/genealogit/commit/28d339157740936c9cb807f8906231cd97422675))
* **visualize:** new command ([b78917f](https://github.com/olets/genealogit/commit/b78917f8fff331dd623f9ad2c000486609ac1cb2))



