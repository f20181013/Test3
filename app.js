(function (){
	angular.module("Test3App",[])
	.controller("NarrowItDownController", NarrowItDownController)
	.service("MenuSearchService", MenuSearchService)
	.constant("API_ENDPOINT","https://davids-restaurant.herokuapp.com/menu_items.json")
	.directive('foundItems', FoundItems)

	function FoundItems(){
		var ddo = {
			template: '{{item.short_name}}, {{item.name}}, {{item.description}}'
		};
		return ddo;
	}

	NarrowItDownController.$inject = ['$scope','MenuSearchService','$filter'];
	function NarrowItDownController($scope,MenuSearchService,$filter){
		var menu=this;
		menu.searchTerm="";
		menu.categories=[];
		menu.found=[];
		menu.error="Nothing Found";
		menu.flag=false;
		menu.onClick = function(){
			menu.found.length=0;
			var promise = MenuSearchService.getMatchedMenuItem();

			promise.then(function (response){
				menu.categories = response.data;
				if(menu.searchTerm.length!=0){
					menu.searchTerm = menu.searchTerm.toLowerCase();
					for(var i=0;i<menu.categories.menu_items.length;i++){
						if(menu.categories.menu_items[i].description.toLowerCase().indexOf(menu.searchTerm)!==-1){
							menu.found.push(menu.categories.menu_items[i]);
						}
						else if(menu.categories.menu_items[i].name.toLowerCase().indexOf(menu.searchTerm)!==-1){
							menu.found.push(menu.categories.menu_items[i]);
						}
					}
					if(menu.found.length==0){
						menu.flag=true;
					}
					else{
						menu.flag=false;
					}
				}
				else{
					menu.flag = true;
				}
				console.log(menu.found.length);
			})
			.catch(function (error){
				console.log(error);
			});
			console.log(menu.categories);
		}
		menu.DontWant = function(index){
			console.log(index);
			menu.found.splice(index,1);
		}	
	}
	MenuSearchService.$inject=['$http','API_ENDPOINT'];	
	function MenuSearchService($http,API_ENDPOINT){
		var service = this;
		service.getMatchedMenuItem = function(){
			var response = $http({
				method: "GET",
				url: API_ENDPOINT
			});
			return response;
		}
	}
})();