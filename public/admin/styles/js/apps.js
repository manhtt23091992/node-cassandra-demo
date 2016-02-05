var vnpApp = angular.module("vnpApp", ["ui.bootstrap", "ngSanitize", "ngRoute"]);
//Filter
vnpApp.filter('formatdate', [
    '$filter', function ($filter) {
        return function (input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
]);

vnpApp.filter('formatjsondate', [
    '$filter', function ($filter) {
        return function (input, format) {
            var date = new Date(parseInt(input.substr(6)));
            return $filter('date')(new Date(date), format);
        };
    }
]);

angular.element(document).ready(function () {
});

vnpApp.filter("strLimit", ["$filter", function ($filter) {
    return function (input, limit) {
        if (input === null) {
            input = "";
        }
        if (input.length <= limit) {
            return input;
        }

        return $filter("limitTo")(input, limit) + '...';
    };
}]);

vnpApp.directive("ngDatePicker", function () {
    return {
        link: function (scope, element, attr) {
            var target = $(element);
            target.datetimepicker({
                format: 'd-m-Y',
                timepicker: false,
                mask: true,
                maxDate: '',
                onSelectDate: function (currentDateTime) {
                    if (target.is('[ng-from-date]')) {
                        var endDatePicker = $("input[ng-end-date]");
                        //set date
                        var fromDateString = currentDateTime.getFullYear() + "-" + ((currentDateTime.getMonth() + 1) < 10 ? '0' : '') + (currentDateTime.getMonth() + 1) + "-" + (currentDateTime.getDate() < 10 ? '0' : '') + currentDateTime.getDate();
                        //console.log("fromDateString " + fromDateString.replace(/-/g, '/'));
                        var _fromDate = Date.parse(fromDateString);
                        //console.log("fromdate " + _fromDate);

                        var toDateString = endDatePicker.val();
                        //console.log("toDateString " + toDateString.replace(/-/g, '/'));
                        var _toDate = Date.parse(toDateString);
                        //console.log("todate " + _toDate);

                        if (_fromDate > _toDate) {
                            endDatePicker.val(fromDateString);
                        }

                        endDatePicker.datetimepicker({
                            minDate: fromDateString.replace(/-/g, '/'),
                            maxDate: ''
                        });
                        endDatePicker.focus();
                    }
                    else if (target.is('[ng-end-date]')) {
                        var startDatePicker = $("input[ng-from-date]");
                        //set date
                        var toDateString = currentDateTime.getFullYear() + "-" + ((currentDateTime.getMonth() + 1) < 10 ? '0' : '') + (currentDateTime.getMonth() + 1) + "-" + (currentDateTime.getDate() < 10 ? '0' : '') + currentDateTime.getDate();
                        //console.log("toDateString " + toDateString.replace(/-/g, '/'));
                        var _toDate = Date.parse(toDateString);
                        //console.log("toDate " + _toDate);

                        var fromDateString = startDatePicker.val();
                        //console.log("fromDateString " + fromDateString.replace(/-/g, '/'));
                        var _fromDate = Date.parse(fromDateString);
                        //console.log("fromdate " + _fromDate);

                        if (_fromDate > _toDate) {
                            startDatePicker.val(toDateString);
                        }

                        startDatePicker.datetimepicker({
                            maxDate: toDateString.replace(/-/g, '/')
                        });
                    }
                }
            });
        }
    };
});

vnpApp.directive("ngReportDatePicker", ["$filter", function ($filter) {
    return {
        link: function (scope, element, attr) {
            jQuery.datetimepicker.setLocale('vi');
            var target = $(element);
            var toDay = new Date();
            toDay.setDate(toDay.getDate() - 1);
            var fromDay = new Date();
            fromDay.setDate(fromDay.getDate() - 93);
            if (target.is('[ng-from-date]')) {
                target.datetimepicker({
                    format: 'd-m-Y',
                    timepicker: false,
                    mask: true,
                    minDate: fromDay,
                    maxDate: toDay,
                    onSelectDate: function (currentDateTime) {
                        var endDatePicker = $("input[ng-end-date]");
                        //set date
                        var fromDateString = currentDateTime.getFullYear() + "-" + ((currentDateTime.getMonth() + 1) < 10 ? '0' : '') + (currentDateTime.getMonth() + 1) + "-" + (currentDateTime.getDate() < 10 ? '0' : '') + currentDateTime.getDate();
                        //console.log("fromDateString " + fromDateString.replace(/-/g, '/'));

                        endDatePicker.datetimepicker({
                            minDate: fromDateString.replace(/-/g, '/'),
                            maxDate: toDay
                        });
                        endDatePicker.focus();
                    }
                });
            }
            else if (target.is('[ng-end-date]')) {
                target.datetimepicker({
                    format: 'd-m-Y',
                    timepicker: false,
                    mask: true,
                    minDate: fromDay,
                    maxDate: toDay,
                    onSelectDate: function (currentDateTime) {
                        var startDatePicker = $("input[ng-from-date]");
                        //set date
                        var toDateString = currentDateTime.getFullYear() + "-" + ((currentDateTime.getMonth() + 1) < 10 ? '0' : '') + (currentDateTime.getMonth() + 1) + "-" + (currentDateTime.getDate() < 10 ? '0' : '') + currentDateTime.getDate();
                        //console.log("toDateString " + toDateString);
                        var _toDate = Date.parse(toDateString);
                        //console.log("toDate " + _toDate);

                        var arrFromDate = startDatePicker.val().split('-');
                        var fromDateString = arrFromDate[2] + "-" + arrFromDate[1] + "-" + arrFromDate[0];
                        //console.log("fromDateString " + fromDateString);
                        var _fromDate = Date.parse(fromDateString);
                        //console.log("fromdate " + _fromDate);

                        if (_fromDate > _toDate) {
                            startDatePicker.val($filter('date')(new Date(_toDate), 'dd-MM-yyyy'));
                        }

                        //console.log("minDate " + $filter('date')(new Date(_toDate).setDate(new Date(_toDate).getDate() - 93), 'yyyy/MM/dd'));
                        //console.log("maxDate " + toDateString.replace(/-/g, '/'));
                        startDatePicker.datetimepicker({
                            minDate: $filter('date')(new Date(_toDate).setDate(new Date(_toDate).getDate() - 93), 'yyyy/MM/dd'),
                            maxDate: toDateString.replace(/-/g, '/')
                        });
                    }
                });
            }
            ;
        }
    };
}]);

vnpApp.controller('UserManagerController', ["$scope", function ($scope) {
    $scope.RspList = [];
    $scope.totalRow = 0;
    $scope.itemsPerPage = 12;
    $scope.currentPage = 1;
    $scope.maxSize = 6;
    //Init variable
    $scope.username = "";
    $scope.roleId = 0;
    $scope.userId = "0";
    $scope.isLocked = "";
    //End init

    $scope.SetUser = function (userId, isLocked) {
        $scope.userId = userId;
        $scope.isLocked = isLocked;
    }

    $scope.UpdateStatus = function () {
        $.ajax({
            url: "../../user/update-status",
            data: {
                userId: $scope.userId,
                isLocked: $scope.isLocked
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetList();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }

    $scope.GetList = function () {
        $.ajax({
            url: "../../user/get-user-list",
            data: {
                userName: $scope.username,
                roleId: $scope.roleId,
                pageNo: $scope.currentPage
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.RspList = data.RspList;
                if (data.RspList.length > 0) {
                    $scope.totalRow = data.TotalRow;
                    //Init index for record
                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
                    if ($scope.toRecord > $scope.totalRow) {
                        $scope.toRecord = $scope.totalRow;
                    }

                    var count = -1;
                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
                        count++;
                        data.RspList[count].index = i;
                    }
                } else {
                    $scope.totalRow = 0;
                }
                console.log($scope.RspList);
                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    };

    //===========Paging Bootstrap=====
    $scope.pageChanged = function () {
        $scope.GetList();
    };
}]);

vnpApp.controller('CategoryController', ["$scope", function ($scope) {
    $scope.ListData = [];
    $scope.RspCode = "";
    $scope.totalRow = 0;
    $scope.itemsPerPage = 12;
    $scope.currentPage = 1;
    $scope.maxSize = 6;

    $scope.module = "";

    $scope.title = "";
    $scope.isLang = "vi";
    $scope.isActive = "";
    //End init

    $scope.SetLang = function (lang) {
        $scope.isLang = lang;
        console.log(lang);
    }

    $scope.SetCate = function (id, status) {
        $scope.id = id;
        $scope.isActive = status;
    }

    $scope.Delete = function () {
        $.ajax({
            url: "../../category/delete",
            data: {
                id: $scope.id
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.RspCode = data.RspCode;
                $scope.GetListCat();

                if (!$scope.$$phase)
                    $scope.$apply();
                console.log($scope.RspCode);
            },
            error: ""
        });
    }

    $scope.UpdateStatus = function () {
        $.ajax({
            url: "../../category/update-status",
            data: {
                cateId: $scope.id,
                status: $scope.isActive
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetListCat();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }

    $scope.GetListCat = function () {
        $.ajax({

            url: "../../category/get-cate-list",
            data: {
                LangCode: $scope.LangCode,
                CatType: $scope.CatType,
                status: $scope.status,
                catname: $scope.catname,
                pageNo: $scope.currentPage
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.ListData = data.ListData;
                if (data.ListData.length > 0) {
                    $scope.totalRow = data.TotalRow;
                    //Init index for record
                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
                    if ($scope.toRecord > $scope.totalRow) {
                        $scope.toRecord = $scope.totalRow;
                    }

                    var count = -1;
                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
                        count++;
                        data.ListData[count].index = i;
                        data.ListData[count].lang = $scope.SplitArr(data.ListData[count].LISTLANG);
                    }
                } else {
                    $scope.totalRow = 0;
                }
                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    };

    //===========Paging Bootstrap=====
    $scope.pageChanged = function () {
        $scope.GetListCat();
    };

    $scope.SplitArr = function (input) {
        var arr = input.split(",");
        var rsArr = [];
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] !== null && arr[i] !== "") {
                    rsArr.push(arr[i]);
                }
            }
        }
        return rsArr;
    }
}]);

vnpApp.controller('PageController', ["$scope", function ($scope) {
    $scope.RspList = [];
    $scope.totalRow = 0;
    $scope.itemsPerPage = 12;
    $scope.currentPage = 1;
    $scope.maxSize = 6;
    //Init variable
    $scope.title = "";
    $scope.pageId = "0";
    $scope.status = "";
    $scope.PageTitle = "";
    $scope.PageAlias = "";
    //End init

    $scope.ChangeTitle = function () {
        $scope.PageAlias = slug($scope.PageTitle, "-");
    }

    $scope.SetPage = function (pageId, status) {
        $scope.pageId = pageId;
        $scope.status = status;
    }

    $scope.UpdateStatus = function () {
        $.ajax({
            url: "../../page/update-status",
            data: {
                pageId: $scope.pageId,
                status: $scope.status
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetList();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }

    $scope.GetList = function () {
        $.ajax({
            url: "../../page/get-page-list",
            data: {
                title: $scope.title,
                pageNo: $scope.currentPage
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.RspList = data.RspList;
                console.log(data.RspList);
                if (data.RspList.length > 0) {
                    $scope.totalRow = data.TotalRow;
                    //Init index for record
                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
                    if ($scope.toRecord > $scope.totalRow) {
                        $scope.toRecord = $scope.totalRow;
                    }
                    var count = -1;
                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
                        count++;
                        data.RspList[count].index = i;
                    }
                } else {
                    $scope.totalRow = 0;
                }
                console.log($scope.RspList);
                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    };

    //===========Paging Bootstrap=====
    $scope.pageChanged = function () {
        $scope.GetList();
    };
}]);

vnpApp.controller('LanguageController', ["$scope", function ($scope) {
    $scope.ListData = [];

    $scope.totalRow = 0;
    $scope.itemsPerPage = 12;
    $scope.currentPage = 1;
    $scope.maxSize = 6;

    $scope.module = "";

    $scope.title = "";
    //End init
    $scope.DeleteID = function (id) {
        $scope.id = id;
    }
    $scope.Delete = function () {
        $.ajax({
            url: "../../language/delete",
            data: {
                id: $scope.id
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetList();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }
    $scope.GetList = function () {
        $.ajax({

            url: "../../language/get-language",
            data: {
                module: $scope.module,

                title: $scope.title,
                pageNo: $scope.currentPage
            },
            type: "POST",
            //beforeSend: function () {
            //    $(".loading").show();
            //},
            //complete: function () {
            //    $(".loading").hide();
            //},
            success: function (data) {
                $scope.ListData = data.ListData;
                console.log(data.ListData);
                if (data.ListData.length > 0) {
                    $scope.totalRow = data.TotalRow;
                    //Init index for record
                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
                    if ($scope.toRecord > $scope.totalRow) {
                        $scope.toRecord = $scope.totalRow;
                    }

                    var count = -1;
                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
                        count++;
                        data.ListData[count].index = i;

                    }
                } else {
                    $scope.totalRow = 0;
                }
                console.log($scope.ListData);
                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    };

    //===========Paging Bootstrap=====
    $scope.pageChanged = function () {
        $scope.GetList();
    };
}]);

vnpApp.controller('SettingsController', ["$scope", function ($scope) {
    $scope.ListData = [];

    $scope.totalRow = 0;
    $scope.itemsPerPage = 12;
    $scope.currentPage = 1;
    $scope.maxSize = 6;
    $scope.title = "";
    //End init
    $scope.DeleteID = function (id) {
        $scope.id = id;
    }
    $scope.Delete = function () {
        $.ajax({
            url: "../../settings/delete",
            data: {
                id: $scope.id
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetListSettings();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }
    $scope.GetListSettings = function () {
        $.ajax({

            url: "../../settings/get-settings",
            data: {
                title: $scope.title,
                pageNo: $scope.currentPage
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.ListData = data.ListData;
                console.log(data.ListData);
                if (data.ListData.length > 0) {
                    $scope.totalRow = data.TotalRow;
                    //Init index for record
                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
                    if ($scope.toRecord > $scope.totalRow) {
                        $scope.toRecord = $scope.totalRow;
                    }

                    var count = -1;
                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
                        count++;
                        data.ListData[count].index = i;

                    }
                } else {
                    $scope.totalRow = 0;
                }
                console.log($scope.ListData);
                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    };

    //===========Paging Bootstrap=====
    $scope.pageChanged = function () {
        $scope.GetListSettings();
    };
}]);

vnpApp.controller('BannerController', ["$scope", function ($scope) {
    $scope.ListData = [];

    $scope.totalRow = 0;
    $scope.itemsPerPage = 12;
    $scope.currentPage = 1;
    $scope.maxSize = 6;

    $scope.module = "";

    $scope.title = "";
    //End init
    $scope.DeleteID = function (id) {
        $scope.id = id;
    }
    $scope.Delete = function () {
        $.ajax({
            url: "../../banner/delete",
            data: {
                id: $scope.id
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetListBanner();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }
    $scope.GetListBanner = function () {
        $.ajax({

            url: "../../banner/get-banner",
            data: {
                LangCode: $scope.LangCode,
                status: $scope.status,
                title: $scope.title,
                pageNo: $scope.currentPage
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.ListData = data.ListData;
                console.log(data.ListData);
                if (data.ListData.length > 0) {
                    $scope.totalRow = data.TotalRow;
                    //Init index for record
                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
                    if ($scope.toRecord > $scope.totalRow) {
                        $scope.toRecord = $scope.totalRow;
                    }

                    var count = -1;
                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
                        count++;
                        data.ListData[count].index = i;

                    }
                } else {
                    $scope.totalRow = 0;
                }
                console.log($scope.ListData);
                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    };

    //===========Paging Bootstrap=====
    $scope.pageChanged = function () {
        $scope.GetListBanner();
    };
}]);

vnpApp.controller('TrashController', ["$scope", function ($scope) {
    $scope.ListData = [];

    $scope.totalRow = 0;
    $scope.itemsPerPage = 12;
    $scope.currentPage = 1;
    $scope.maxSize = 6;

    $scope.module = "";

    $scope.title = "";
    //End init
    $scope.RestoreID = function (id) {
        $scope.id = id;
    }
    $scope.DeleteID = function (iddel) {
        $scope.iddel = iddel;
    }
    $scope.Delete = function () {
        $.ajax({
            url: "../../trash/delete",
            data: {
                iddel: $scope.iddel
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetListTrash();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }
    $scope.Restore = function () {
        $.ajax({
            url: "../../trash/restore",
            data: {
                id: $scope.id
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetListTrash();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }
    $scope.GetListTrash = function () {
        $.ajax({

            url: "../../trash/get-trash",
            data: {
                tablename: $scope.tablename,
                dataname: $scope.dataname,
                pageNo: $scope.currentPage
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.RspList = data.RspList;
                if (data.RspList.length > 0) {
                    $scope.totalRow = data.TotalRow;
                    //Init index for record
                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
                    if ($scope.toRecord > $scope.totalRow) {
                        $scope.toRecord = $scope.totalRow;
                    }

                    var count = -1;
                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
                        count++;
                        data.RspList[count].index = i;

                    }
                } else {
                    $scope.totalRow = 0;
                }
                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    };

    //===========Paging Bootstrap=====
    $scope.pageChanged = function () {
        $scope.GetListTrash();
    };

}]);

vnpApp.controller('WidgetsController', ["$scope", function ($scope) {
    $scope.RspList = [];
    $scope.totalRow = 0;
    $scope.itemsPerPage = 12;
    $scope.currentPage = 1;
    $scope.maxSize = 6;
    $scope.RspCode = "";
    $scope.title = "";
    $scope.page = "";
    //End init

    $scope.wgId = "0";
    $scope.status = "";
    //End init
    $scope.SetStatus = function (wgId, status) {
        $scope.wgId = wgId;
        $scope.status = status;
    }
    $scope.DeleteID = function (iddel) {
        $scope.iddel = iddel;
    }
    $scope.Delete = function () {
        $.ajax({
            url: "../../widgets/delete",
            data: {
                iddel: $scope.iddel
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.RspCode = data.RspCode;
                $scope.GetListWidgets();

                if (!$scope.$$phase)
                    $scope.$apply();
                console.log($scope.RspCode);
            },
            error: ""
        });
    }
    $scope.UpdateStatus = function () {
        $.ajax({
            url: "../../widgets/update-status",
            data: {
                wgId: $scope.wgId,
                status: $scope.status
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetListWidgets();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }

    $scope.GetListWidgets = function () {
        $.ajax({

            url: "../../widgets/get-widgets-list",
            data: {
                title: $scope.title,
                page: $scope.page,
                pageNo: $scope.currentPage
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.RspList = data.RspList;
                if (data.RspList.length > 0) {
                    $scope.totalRow = data.TotalRow;
                    //Init index for record
                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
                    if ($scope.toRecord > $scope.totalRow) {
                        $scope.toRecord = $scope.totalRow;
                    }

                    var count = -1;
                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
                        count++;
                        data.RspList[count].index = i;

                    }
                } else {
                    $scope.totalRow = 0;
                }
                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    };

    //===========Paging Bootstrap=====
    $scope.pageChanged = function () {
        $scope.GetListWidgets();
    };

}]);

vnpApp.controller('PostController', ["$scope", "$filter", function ($scope, $filter) {
    $scope.RspList = [];
    $scope.PostDetail = null;
    $scope.PostLang = [];
    $scope.totalRow = 0;
    $scope.itemsPerPage = 12;
    $scope.currentPage = 1;
    $scope.maxSize = 6;

    $scope.title = "";
    $scope.cate = "";
    $scope.status = "";
    $scope.page = "";
    $scope.createFrom = "";
    $scope.createTo = "";
    $scope.publishFrom = $filter('date')(new Date().setDate(new Date().getDate() - 30), 'dd-MM-yyyy');;
    $scope.publishTo = $filter('date')(new Date().setDate(new Date().getDate()), 'dd-MM-yyyy');

    $scope.originId = "";
    $scope.poststatus = "";
    $scope.isLang = "vi";
    //End init
    $scope.SetLang = function (lang) {
        $scope.isLang = lang;
        console.log(lang);
    }

    $scope.SetStatus = function (originId, poststatus) {
        $scope.originId = originId;
        $scope.poststatus = poststatus;
    }

    $scope.UpdateStatus = function () {
        $.ajax({
            url: "../../post/update-status",
            data: {
                originId: $scope.originId,
                status: $scope.poststatus
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetList();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }

    $scope.Delete = function () {
        $.ajax({
            url: "../../post/delete",
            data: {
                originId: $scope.originId
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetList();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }

    $scope.ViewDetail = function (postId) {
        $.ajax({
            url: "../../post/view-detail",
            data: {
                postId: postId
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                console.log(data);
                $scope.PostDetail = data.Post;
                $scope.PostLang = data.OrginPostList;

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }

    $scope.GetList = function () {
        $.ajax({
            url: "../../post/get-post-list",
            data: {
                cate: $scope.cate,
                title: $scope.title,
                status: $scope.status,
                page: $scope.page,
                createFrom: $scope.createFrom,
                createTo: $scope.createTo,
                publishFrom: $scope.publishFrom,
                publishTo: $scope.publishTo,
                pageNo: $scope.currentPage
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.RspList = data.RspList;
                if (data.RspList.length > 0) {
                    $scope.totalRow = data.TotalRow;
                    //Init index for record
                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
                    if ($scope.toRecord > $scope.totalRow) {
                        $scope.toRecord = $scope.totalRow;
                    }

                    var count = -1;
                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
                        count++;
                        data.RspList[count].index = i;
                        data.RspList[count].lang = $scope.SplitArr(data.RspList[count].LISTLANG);
                    }
                } else {
                    $scope.totalRow = 0;
                }
                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    };

    $scope.PostTypeChange = function () {
        //console.log($scope.PostType);
    }

    //===========Paging Bootstrap=====
    $scope.pageChanged = function () {
        $scope.GetList();
    };

    $scope.SplitArr = function (input) {
        var arr = input.split(",");
        var rsArr = [];
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] !== null && arr[i] !== "") {
                    rsArr.push(arr[i]);
                }
            }
        }
        return rsArr;
    }

}]);

vnpApp.controller('UrlController', ["$scope", function ($scope) {
    $scope.RspList = [];
    $scope.totalRow = 0;
    $scope.itemsPerPage = 12;
    $scope.currentPage = 1;
    $scope.maxSize = 6;
    //Init variable
    $scope.title = "";
    $scope.controller = "";
    $scope.action = "";
    $scope.id = 0;
    $scope.FriendlyUrl = "";
    //End init

    $scope.ChangeTitle = function () {
        $scope.FriendlyUrl = slug($scope.Title, "-");
    }

    $scope.SetId = function (id) {
        console.log(id);
        $scope.id = id;
    }

    $scope.Delete = function () {
        $.ajax({
            url: "../../url/delete",
            data: {
                id: $scope.id
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.GetList();

                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    }

    $scope.GetList = function () {
        $.ajax({
            url: "../../url/get-url-list",
            data: {
                title: $scope.title,
                controller: $scope.controller,
                action: $scope.action,
                pageNo: $scope.currentPage
            },
            type: "POST",
            beforeSend: function () {
                $(".loading").show();
            },
            complete: function () {
                $(".loading").hide();
            },
            success: function (data) {
                $scope.RspList = data.RspList;
                console.log(data.RspList);
                if (data.RspList.length > 0) {
                    $scope.totalRow = data.TotalRow;
                    //Init index for record
                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
                    if ($scope.toRecord > $scope.totalRow) {
                        $scope.toRecord = $scope.totalRow;
                    }
                    var count = -1;
                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
                        count++;
                        data.RspList[count].index = i;
                    }
                } else {
                    $scope.totalRow = 0;
                }
                if (!$scope.$$phase)
                    $scope.$apply();
            },
            error: ""
        });
    };

    //===========Paging Bootstrap=====
    $scope.pageChanged = function () {
        $scope.GetList();
    };
}]);

//=============================SinglePage Config==================================
//vnpApp.directive('routeLoadingIndicator', function ($rootScope) {
//    return {
//        restrict: 'E',
//        template: "<div ng-show='isRouteLoading' id='loader-wrapper'>" +
//        "<div id='loader'></div>" +
//    "</div>",
//        replace: true,
//        link: function (scope, elem, attrs) {
//            scope.isRouteLoading = false;

//            $rootScope.$on('$routeChangeStart', function () {
//                scope.isRouteLoading = true;
//            });
//            $rootScope.$on('$routeChangeSuccess', function () {
//                scope.isRouteLoading = false;
//            });
//        }
//    };
//});

//vnpApp.directive('stateLoadingIndicator', function ($rootScope) {
//    return {
//        restrict: 'E',
//        template: "<div ng-show='isRouteLoading' id='loader-wrapper'>" +
//         "<div id='loader'></div>" +
//     "</div>",
//        replace: true,
//        link: function (scope, elem, attrs) {
//            scope.isStateLoading = false;

//            $rootScope.$on('$stateChangeStart', function () {
//                scope.isStateLoading = true;
//            });
//            $rootScope.$on('$stateChangeSuccess', function () {
//                scope.isStateLoading = false;
//            });
//        }
//    };
//});

//vnpApp.factory("ShareData", function () {
//    return { value: 0 }
//});

//vnpApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
//    //======================Page=================
//    $routeProvider.when('/admin/page.htm',
//                        {
//                            templateUrl: '/admin/Page/PageIndex.htm',
//                            controller: 'PageApiController'
//                        });
//    $routeProvider.when('/admin/page/create.htm',
//                        {
//                            templateUrl: '/admin/Page/CreatePage.htm',
//                            controller: 'PageApiController'
//                        });
//    $routeProvider.when('/admin/page/edit.htm',
//                       {
//                           templateUrl: '/admin/Page/EditPage.htm',
//                           controller: 'PageApiController'
//                       });

//    //======================Banner=================
//    $routeProvider.when('/admin/banner.htm',
//                       {
//                           templateUrl: '/admin/Banner/BannerIndex.htm',
//                           controller: 'BannerApiController'
//                       });
//    $routeProvider.when('/admin/banner/create.htm',
//                       {
//                           templateUrl: '/admin/Banner/CreateBanner.htm',
//                           controller: 'BannerApiController'
//                       });
//    $routeProvider.when('/admin/banner/edit.htm',
//                      {
//                          templateUrl: '/admin/Banner/EditBanner.htm',
//                          controller: 'BannerApiController'
//                      });

//    //======================Post=================
//    $routeProvider.when('/admin/post.htm',
//                       {
//                           templateUrl: '/admin/Post/PostIndex.htm',
//                           controller: 'PostApiController'
//                       });
//    $routeProvider.when('/admin/post/create.htm',
//                       {
//                           templateUrl: '/admin/Post/CreatePost.htm',
//                           controller: 'PostApiController'
//                       });

//    $routeProvider.otherwise(
//                        {
//                            redirectTo: '/admin'
//                        });

//    $locationProvider.html5Mode({
//        enabled: true,
//        requireBase: false
//    });
//}]);

//vnpApp.service("VnpayService", function ($http) {
//    //====Page======
//    this.getPages = function (title, pageNo) {
//        return $http.get("/api/PageApi?title=" + title + "&pageNo=" + pageNo);
//    };
//    this.getAllPage = function () {
//        return $http.get("/api/PageApi");
//    };
//    this.updatePageStatus = function (pageId, status) {
//        return $http.get("/api/PageApi?pageId=" + pageId + "&status=" + status);
//    }
//    this.createPage = function (PageModel) {
//        var request = $http({
//            method: "post",
//            url: "/api/PageApi",
//            data: PageModel
//        });
//        return request;
//    };
//    this.getPageById = function (pageId) {
//        return $http.get("/api/PageApi?pageId=" + pageId);
//    }
//    this.editPage = function (pageId, PageModel) {
//        var request = $http({
//            method: "post",
//            url: "/api/PageApi/" + pageId,
//            data: PageModel
//        });
//        return request;
//    };

//    //======Banner====
//    this.getBanner = function (title, status, pageNo) {
//        return $http.get("/api/BannerApi?title=" + title + "&pageNo=" + pageNo + "&status=" + status);
//    };
//    this.createBanner = function (BannerModel) {
//        var request = $http({
//            method: "post",
//            url: "/api/BannerApi",
//            data: BannerModel
//        });
//        return request;
//    };
//    this.deleteBanner = function (bannerId) {
//        var request = $http({
//            method: "post",
//            url: "/api/BannerApi?bannerId=" + bannerId
//        });
//        return request;
//    }
//    this.getBannerById = function (pageId) {
//        return $http.get("/api/BannerApi?bannerId=" + pageId);
//    }
//    this.getCateByBannerGuid = function (bannerGuid) {
//        return $http.get("/api/BannerApi?bannerGuid=" + bannerGuid);
//    }
//    this.editBanner = function (bannerId, BannerModel) {
//        var request = $http({
//            method: "post",
//            url: "/api/BannerApi/" + bannerId,
//            data: BannerModel
//        });
//        return request;
//    };

//    //========Post=======
//    this.getPost = function (cate, title, status, page, createFrom, createTo, publishFrom, publishTo, pageNo) {
//        return $http.get("/api/PostApi?cate=" + cate + "&title=" + title + "&status=" + status + "&page=" + page + "&createFrom=" + createFrom + "&createTo=" + createTo + "&publishFrom=" + publishFrom + "&publishTo=" + publishTo + "&pageNo=" + pageNo);
//    };
//    this.getPostById = function (postId) {
//        return $http.get("/api/PostApi?postId=" + postId);
//    }
//    this.updatePostStatus = function (postId, status) {
//        var request = $http({
//            method: "post",
//            url: "/api/PostApi?originId=" + postId + "&status=" + status
//        });
//        return request;
//    }
//    this.deletePost = function (originId) {
//        var request = $http({
//            method: "post",
//            url: "/api/PostApi?originPostId=" + originId
//        });
//        return request;
//    }
//    this.createPost = function (PostViewModel) {
//        var request = $http({
//            method: "post",
//            url: "/api/PostApi",
//            data: PostViewModel
//        });
//        return request;
//    };

//    //=====Language====
//    this.getAllLanguage = function () {
//        return $http.get("/api/LanguageApi");
//    };

//    //=====Category====
//    this.getAllCategory = function () {
//        return $http.get("/api/CategoryApi");
//    };

//    //======Widgets=======
//    this.getAllWidget = function () {
//        return $http.get("/api/WidgetsApi");
//    };
//});

//vnpApp.controller('PageApiController', ['$scope', '$http', '$location', 'VnpayService', '$timeout', function ($scope, $http, $location, VnpayService, $timeout) {
//    $scope.RspList = [];
//    $scope.ObjPage = null;
//    $scope.totalRow = 0;
//    $scope.itemsPerPage = 12;
//    $scope.currentPage = 1;
//    $scope.maxSize = 6;
//    //Init variable
//    $scope.title = "";
//    $scope.pageId = "1";
//    $scope.status = "1";
//    $scope.PageTitle = "";
//    $scope.PageAlias = "";

//    $scope.CreatePageLoad = function () {

//        var sPage = VnpayService.getAllPage();
//        sPage.then(
//            function (pl) {
//                $scope.RspList = pl.data.rspList;
//                $(".search-select").select2();
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });
//    }

//    $scope.EditPageLoad = function () {
//        $scope.itemsList = [];
//        var sPage = VnpayService.getPageById($location.search().id);
//        sPage.then(
//            function (pl) {
//                $scope.ObjPage = pl.data.rspList;

//                $scope.pageId = $scope.ObjPage.PAGE_ID;
//                $scope.PageTitle = $scope.ObjPage.PAGE_TITLE;
//                $scope.PageAlias = $scope.ObjPage.PAGE_ALIAS;
//                $scope.PageDescription = $scope.ObjPage.PAGE_DESCRIPTION;
//                $scope.PageParentid = $scope.ObjPage.PAGE_PARENTID;
//                $scope.PageLink = $scope.ObjPage.PAGE_LINK;
//                $scope.Ord = $scope.ObjPage.ORD;
//                $scope.Status = $scope.ObjPage.STATUS;
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        var sAllPage = VnpayService.getAllPage();
//        sAllPage.then(
//            function (pl) {
//                $scope.RspList = pl.data.rspList;
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        $timeout(function () {
//            for (var i = 0; i < $scope.RspList.length; i++) {
//                if ($scope.RspList[i].PAGE_ID === $scope.ObjPage.PAGE_PARENTID) {
//                    var item = {
//                        PageId: $scope.RspList[i].PAGE_ID,
//                        PageTitle: $scope.RspList[i].PAGE_TITLE,
//                        selected: true
//                    };
//                    $scope.itemsList.push(item);
//                } else {
//                    var item1 = {
//                        PageId: $scope.RspList[i].PAGE_ID,
//                        PageTitle: $scope.RspList[i].PAGE_TITLE
//                    };
//                    $scope.itemsList.push(item1);
//                }
//            }
//            $timeout(function () {
//                $(".search-select").select2();
//            }, 2000);

//        }, 1000);
//    }

//    $scope.SetPage = function (pageId, status) {
//        $scope.pageId = pageId;
//        $scope.status = status;
//        if (status === "1") {
//            $('#block-popup').modal('show');
//        } else {
//            $('#unblock-popup').modal('show');
//        }
//    }

//    $scope.ChangeTitle = function () {
//        $scope.PageAlias = slug($scope.PageTitle, "-");
//    }

//    $scope.UpdateStatus = function () {
//        var sPage = VnpayService.updatePageStatus($scope.pageId, $scope.status);
//        sPage.then(
//           function (pl) {
//               $scope.search();
//               $(".loading").hide();
//           },
//           function (errorPl) {
//               $scope.error = errorPl;
//           });
//    }

//    $scope.search = function () {
//        $(".loading").show();
//        var sPage = VnpayService.getPages($scope.title, $scope.currentPage);
//        sPage.then(
//            function (pl) {
//                $scope.RspList = pl.data.rspList;
//                if (pl.data.rspList.length > 0) {
//                    $scope.totalRow = pl.data.TotalRow;
//                    //Init index for record
//                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
//                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
//                    if ($scope.toRecord > $scope.totalRow) {
//                        $scope.toRecord = $scope.totalRow;
//                    }
//                    var count = -1;
//                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
//                        count++;
//                        pl.data.rspList[count].index = i;
//                    }
//                } else {
//                    $scope.totalRow = 0;
//                }
//                $(".loading").hide();
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });
//    }

//    $scope.createPage = function () {
//        var PageModel = {
//            PageTitle: $scope.PageTitle,
//            PageAlias: $scope.PageAlias,
//            PageDescription: $scope.PageDescription,
//            PageParentid: $scope.PageParentid,
//            PageLink: $scope.PageLink,
//            Ord: $scope.Ord,
//            Status: $scope.Status
//        };

//        var promisePost = VnpayService.createPage(PageModel);

//        promisePost.then(function (pl) {
//            $location.path('/admin/page.htm');
//        },
//        function (errorPl) {
//            $scope.error = 'failure loading Student', errorPl;
//        });
//    }

//    $scope.editPage = function () {
//        var PageModel = {
//            PageTitle: $scope.PageTitle,
//            PageAlias: $scope.PageAlias,
//            PageDescription: $scope.PageDescription,
//            PageParentid: $scope.PageParentid,
//            PageLink: $scope.PageLink,
//            Ord: $scope.Ord,
//            Status: $scope.Status
//        };

//        var promisePost = VnpayService.editPage($scope.pageId, PageModel);

//        promisePost.then(function (pl) {
//            $location.path('/admin/page.htm');
//        },
//        function (errorPl) {
//            $scope.error = 'failure loading Student', errorPl;
//        });
//    };

//    //===========Paging Bootstrap=====
//    $scope.pageChanged = function () {
//        $scope.search();
//    };
//}]);

//vnpApp.controller('BannerApiController', ['$scope', '$http', '$location', 'VnpayService', '$timeout', function ($scope, $http, $location, VnpayService, $timeout) {
//    $scope.RspList = [];
//    $scope.ObjBanner = null;
//    $scope.totalRow = 0;
//    $scope.itemsPerPage = 12;
//    $scope.currentPage = 1;
//    $scope.maxSize = 6;
//    //Init variable
//    $scope.title = "";
//    $scope.Status = "";
//    $scope.bannerId = "0";

//    $scope.initPage = function () {
//        $(".loading").show();
//        var sPage = VnpayService.getBanner($scope.title, $scope.Status, $scope.currentPage);
//        sPage.then(
//            function (pl) {
//                $scope.RspList = pl.data.rspList;
//                if (pl.data.rspList.length > 0) {
//                    $scope.totalRow = pl.data.TotalRow;
//                    //Init index for record
//                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
//                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
//                    if ($scope.toRecord > $scope.totalRow) {
//                        $scope.toRecord = $scope.totalRow;
//                    }
//                    var count = -1;
//                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
//                        count++;
//                        pl.data.rspList[count].index = i;
//                    }
//                } else {
//                    $scope.totalRow = 0;
//                }
//                $(".loading").hide();
//                $(".search-select").select2();
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });
//    }

//    $scope.search = function () {
//        console.log($scope.Status);
//        $(".loading").show();
//        var sPage = VnpayService.getBanner($scope.title, $scope.Status, $scope.currentPage);
//        sPage.then(
//            function (pl) {
//                $scope.RspList = pl.data.rspList;
//                if (pl.data.rspList.length > 0) {
//                    $scope.totalRow = pl.data.TotalRow;
//                    //Init index for record
//                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
//                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
//                    if ($scope.toRecord > $scope.totalRow) {
//                        $scope.toRecord = $scope.totalRow;
//                    }
//                    var count = -1;
//                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
//                        count++;
//                        pl.data.rspList[count].index = i;
//                    }
//                } else {
//                    $scope.totalRow = 0;
//                }
//                $(".loading").hide();
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });
//    }

//    $scope.CreatePageLoad = function () {
//        $("#btnSelectImg").click(function () {
//            var finder = new CKFinder();
//            finder.selectActionFunction = function (fileUrl) {
//                $('#ImageUrl').val(fileUrl);
//                $scope.ImageUrl = fileUrl;
//            };
//            finder.popup();
//            return false;
//        });

//        var sLanguage = VnpayService.getAllLanguage();
//        sLanguage.then(
//            function (pl) {
//                $scope.LanguageList = pl.data.rspList;
//                $(".search-select").select2();
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        var sCate = VnpayService.getAllCategory();
//        sCate.then(
//            function (pl) {
//                $scope.CateList = pl.data.rspList;
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });
//    }

//    $scope.createBanner = function () {
//        var BannerModel = {
//            LangCode: $scope.LangCode,
//            BannerTitle: $scope.BannerTitle,
//            BannerDescription: $scope.BannerDescription,
//            BannerKeyword: $scope.BannerKeyword,
//            ImageUrl: $scope.ImageUrl,
//            Link: $scope.Link,
//            Ord: $scope.Ord,
//            Status: $scope.Status,
//            Category: $scope.Category
//        };

//        var promisePost = VnpayService.createBanner(BannerModel);

//        promisePost.then(function (pl) {
//            $location.path('/admin/banner.htm');
//        },
//        function (errorPl) {
//            $scope.error = 'failure loading Student', errorPl;
//        });
//    }

//    $scope.SetBannerId = function (bannerId) {
//        $scope.bannerId = bannerId;
//        $('#delete-popup').modal('show');
//    }

//    $scope.Delete = function () {
//        var sPage = VnpayService.deleteBanner($scope.bannerId);
//        sPage.then(
//           function (pl) {
//               $scope.search();
//               $(".loading").hide();
//           },
//           function (errorPl) {
//               $scope.error = errorPl;
//           });
//    }

//    $scope.EditPageLoad = function () {
//        $("#btnSelectImg").click(function () {
//            var finder = new CKFinder();
//            finder.selectActionFunction = function (fileUrl) {
//                $('#ImageUrl').val(fileUrl);
//                $scope.ImageUrl = fileUrl;
//            };
//            finder.popup();
//            return false;
//        });

//        var sBanner = VnpayService.getBannerById($location.search().id);
//        sBanner.then(
//            function (pl) {
//                $scope.ObjBanner = pl.data.rspList;
//                console.log($scope.ObjBanner);
//                $scope.LangCode = $scope.ObjBanner.LANG_CODE;
//                $scope.BannerId = $scope.ObjBanner.BANNER_ID;
//                $scope.BannerTitle = $scope.ObjBanner.BANNER_TITLE;
//                $scope.BannerDescription = $scope.ObjBanner.BANNER_DESCRIPTION;
//                $scope.BannerKeyword = $scope.ObjBanner.BANNER_KEYWORD;
//                $scope.ImageUrl = $scope.ObjBanner.IMAGE_URL;
//                $scope.Link = $scope.ObjBanner.LINK;
//                $scope.Ord = $scope.ObjBanner.ORD;
//                $scope.Status = $scope.ObjBanner.STATUS;

//                var sCateBanner = VnpayService.getCateByBannerGuid($scope.ObjBanner.BANNER_GUID);
//                sCateBanner.then(
//                    function (pl) {
//                        $scope.CateBannerList = pl.data.rspList;
//                        console.log($scope.CateBannerList);
//                    },
//                    function (errorPl) {
//                        $scope.error = errorPl;
//                    });
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        var sLanguage = VnpayService.getAllLanguage();
//        sLanguage.then(
//            function (pl) {
//                $scope.LanguageList = pl.data.rspList;
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        var sCate = VnpayService.getAllCategory();
//        sCate.then(
//            function (pl) {
//                $scope.CateList = pl.data.rspList;
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        $scope.OffLangList = [];
//        $scope.OffCateList = [];

//        $timeout(function () {
//            for (var i = 0; i < $scope.LanguageList.length; i++) {
//                if ($scope.LanguageList[i].LANG_CODE === $scope.ObjBanner.LANG_CODE) {
//                    var item = {
//                        LangCode: $scope.LanguageList[i].LANG_CODE,
//                        LangName: $scope.LanguageList[i].LANG_NAME,
//                        selected: true
//                    };
//                    $scope.OffLangList.push(item);
//                } else {
//                    var item1 = {
//                        LangCode: $scope.LanguageList[i].LANG_CODE,
//                        LangName: $scope.LanguageList[i].LANG_NAME
//                    };
//                    $scope.OffLangList.push(item1);
//                }
//            }

//            for (var j = 0; j < $scope.CateList.length; j++) {
//                var cate = Lazy($scope.CateBannerList).where({ CATE_ID: $scope.CateList[j].CATE_ID }).toArray();
//                if (cate.length > 0) {
//                    var item_21 = {
//                        CateGuid: $scope.CateList[j].CATE_GUID,
//                        CateName: $scope.CateList[j].CATE_NAME,
//                        selected: true
//                    };
//                    $scope.OffCateList.push(item_21);
//                } else {
//                    var item_22 = {
//                        CateGuid: $scope.CateList[j].CATE_GUID,
//                        CateName: $scope.CateList[j].CATE_NAME,
//                    };
//                    $scope.OffCateList.push(item_22);
//                }
//            }

//            $timeout(function () {
//                $(".search-select").select2();
//            }, 2000);

//        }, 1000);
//    }

//    $scope.editBanner = function () {
//        var BannerModel = {
//            LangCode: $scope.LangCode,
//            BannerTitle: $scope.BannerTitle,
//            BannerDescription: $scope.BannerDescription,
//            BannerKeyword: $scope.BannerKeyword,
//            ImageUrl: $scope.ImageUrl,
//            Link: $scope.Link,
//            Ord: $scope.Ord,
//            Status: $scope.Status,
//            Category: $scope.Category
//        };

//        var promisePost = VnpayService.editBanner($scope.BannerId, BannerModel);

//        promisePost.then(function (pl) {
//            $location.path('/admin/banner.htm');
//        },
//        function (errorPl) {
//            $scope.error = 'failure loading Student', errorPl;
//        });
//    };

//    //===========Paging Bootstrap=====
//    $scope.pageChanged = function () {
//        $scope.search();
//    };
//}]);

//vnpApp.controller('PostApiController', ['$scope', '$http', '$filter', '$location', 'VnpayService', '$timeout', function ($scope, $http, $filter, $location, VnpayService, $timeout) {
//    $scope.RspList = [];
//    $scope.PageList = [];
//    $scope.CateList = [];
//    $scope.WidgetList = [];
//    $scope.ObjPost = null;
//    $scope.totalRow = 0;
//    $scope.itemsPerPage = 12;
//    $scope.currentPage = 1;
//    $scope.maxSize = 6;
//    $scope.isLang = "vi";

//    //Init variable
//    $scope.postId = "0";
//    $scope.postStatus = "0";
//    $scope.title = "";
//    $scope.cate = "";
//    $scope.status = "";
//    $scope.page = "";
//    $scope.createFrom = "";
//    $scope.createTo = "";
//    $scope.publishFrom = $filter('date')(new Date().setDate(new Date().getDate() - 30), 'dd-MM-yyyy');;
//    $scope.publishTo = $filter('date')(new Date().setDate(new Date().getDate()), 'dd-MM-yyyy');

//    $scope.initPage = function () {
//        $(".loading").show();

//        var sAllPage = VnpayService.getAllPage();
//        sAllPage.then(
//            function (pl) {
//                $scope.PageList = pl.data.rspList;
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        var sAllCate = VnpayService.getAllCategory();
//        sAllCate.then(
//            function (pl) {
//                $scope.CateList = pl.data.rspList;
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        var sPage = VnpayService.getPost($scope.cate, $scope.title, $scope.status, $scope.page, $scope.createFrom, $scope.createTo, $scope.publishFrom, $scope.publishTo, $scope.currentPage);
//        sPage.then(
//            function (pl) {
//                $scope.RspList = pl.data.rspList;
//                if (pl.data.rspList.length > 0) {
//                    $scope.totalRow = pl.data.TotalRow;
//                    //Init index for record
//                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
//                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
//                    if ($scope.toRecord > $scope.totalRow) {
//                        $scope.toRecord = $scope.totalRow;
//                    }
//                    var count = -1;
//                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
//                        count++;
//                        pl.data.rspList[count].index = i;
//                        pl.data.rspList[count].lang = $scope.SplitArr(pl.data.rspList[count].LISTLANG);
//                    }
//                } else {
//                    $scope.totalRow = 0;
//                }
//                $(".loading").hide();
//                $(".search-select").select2();
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });
//    }

//    $scope.search = function () {
//        $(".loading").show();
//        var sPage = VnpayService.getPost($scope.cate, $scope.title, $scope.status, $scope.page, $scope.createFrom, $scope.createTo, $scope.publishFrom, $scope.publishTo, $scope.currentPage);
//        sPage.then(
//            function (pl) {
//                $scope.RspList = pl.data.rspList;
//                if (pl.data.rspList.length > 0) {
//                    $scope.totalRow = pl.data.TotalRow;
//                    //Init index for record
//                    $scope.fromRecord = (($scope.currentPage - 1) * $scope.itemsPerPage) + 1;
//                    $scope.toRecord = ($scope.currentPage * $scope.itemsPerPage);
//                    if ($scope.toRecord > $scope.totalRow) {
//                        $scope.toRecord = $scope.totalRow;
//                    }
//                    var count = -1;
//                    for (var i = $scope.fromRecord; i <= $scope.toRecord; i++) {
//                        count++;
//                        pl.data.rspList[count].index = i;
//                        pl.data.rspList[count].lang = $scope.SplitArr(pl.data.rspList[count].LISTLANG);
//                    }
//                } else {
//                    $scope.totalRow = 0;
//                }
//                $(".loading").hide();
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });
//    }

//    $scope.ViewDetail = function (postId) {
//        var sPost = VnpayService.getPostById(postId);
//        sPost.then(
//            function (pl) {
//                $scope.ObjPost = pl.data.Post;
//                $('#detailModal').modal('show');
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });
//    }

//    $scope.UpdateStatus = function () {
//        var sPage = VnpayService.updatePostStatus($scope.postId, $scope.postStatus);
//        sPage.then(
//           function (pl) {
//               $scope.search();
//               $(".loading").hide();
//           },
//           function (errorPl) {
//               $scope.error = errorPl;
//           });
//    }

//    $scope.Delete = function () {
//        var sPage = VnpayService.deletePost($scope.postId);
//        sPage.then(
//           function (pl) {
//               $scope.search();
//               $(".loading").hide();
//           },
//           function (errorPl) {
//               $scope.error = errorPl;
//           });
//    }

//    $scope.SetStatus = function (postId, status) {
//        $scope.postId = postId;
//        $scope.postStatus = status;
//        if (status === "1") {
//            $('#block-popup').modal('show');
//        } else {
//            $('#unblock-popup').modal('show');
//        }
//    }

//    $scope.SetDeleteId = function (postId) {
//        $scope.postId = postId;
//        $('#delete-popup').modal('show');
//    }

//    $scope.CreatePageLoad = function () {
//        $scope.ObjPostTile = {};
//        $scope.ObjPostDesc = {};
//        $scope.ObjPostContent1 = {};
//        $scope.ObjPostContent2 = {};

//        $("#btnSelectImg").click(function () {
//            var finder = new CKFinder();
//            finder.selectActionFunction = function (fileUrl) {
//                $('#PostThumbnail').val(fileUrl);
//                $scope.ImageUrl = fileUrl;
//            };
//            finder.popup();
//            return false;
//        });

//        var sLanguage = VnpayService.getAllLanguage();
//        sLanguage.then(
//            function (pl) {
//                $scope.LanguageList = pl.data.rspList;
//                $(".search-select").select2();
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        var sCate = VnpayService.getAllCategory();
//        sCate.then(
//            function (pl) {
//                $scope.CateList = pl.data.rspList;
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        var sWidget = VnpayService.getAllWidget();
//        sWidget.then(
//            function (pl) {
//                $scope.WidgetList = pl.data.rspList;
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        $timeout(function () {
//            for (var i = 0; i < $scope.LanguageList.length; i++) {
//                CKEDITOR.replace('PostContent_' + $scope.LanguageList[i].LANG_CODE, {
//                    toolbarGroups: [
//                { name: 'document', groups: ['mode', 'document'] },			// Displays document group with its two subgroups.
//                { name: 'clipboard', groups: ['clipboard', 'undo'] },			// Group's name will be used to create voice label.
//                '/',																// Line break - next group will be placed in new line.
//                { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
//                { name: 'paragraph', groups: ['list', 'blocks', 'align', 'paragraph'] },
//                { name: 'links' },
//                    { name: 'insert' }
//                    ]

//                });

//                var editor = new TINY.editor.edit('editor_' + $scope.LanguageList[i].LANG_CODE, {
//                    id: 'PostHtml_' + $scope.LanguageList[i].LANG_CODE,
//                    height: 175,
//                    width: 740,
//                    cssclass: 'tinyeditor',
//                    controlclass: 'tinyeditor-control',
//                    rowclass: 'tinyeditor-header',
//                    dividerclass: 'tinyeditor-divider',
//                    controls: [],
//                    footer: true,
//                    fonts: ['Verdana', 'Arial', 'Georgia', 'Trebuchet MS'],
//                    xhtml: true,
//                    cssfile: 'custom.css',
//                    bodyid: 'editor',
//                    footerclass: 'tinyeditor-footer',
//                    toggle: { text: 'source', activetext: 'display', cssclass: 'toggle' },
//                    resize: { cssclass: 'resize' }
//                });
//            }

//        }, 1000);
//    }

//    $scope.CheckLangButton = function (lang) {
//        var cl = "";
//        if ($scope.isLang === lang.LANG_CODE) {
//            cl = "btn-active";
//        }
//        return cl;
//    }

//    $scope.SetLang = function (lang) {
//        $scope.isLang = lang;
//    }

//    $scope.createPost = function () {
//        var listPostLang = [];

//        //for (var i = 0; i < $scope.LanguageList.length; i++) {

//        //    var contentValue1 = "";
//        //    var contentValue2 = "";
//        //    if ($scope.LanguageList[i].LANG_CODE === "vi") {
//        //        contentValue1 = CKEDITOR.instances.PostContent_vi.getData();
//        //        contentValue2 = CKEDITOR.instances.PostHtml_vi.getData();
//        //    }
//        //    if ($scope.LanguageList[i].LANG_CODE === "en") {
//        //        contentValue1 = CKEDITOR.instances.PostContent_en.getData();
//        //        contentValue2 = CKEDITOR.instances.PostHtml_en.getData();
//        //    }
//        //    if ($scope.LanguageList[i].LANG_CODE === "cam") {
//        //        contentValue1 = CKEDITOR.instances.PostContent_cam.getData();
//        //        contentValue2 = CKEDITOR.instances.PostHtml_cam.getData();
//        //    }

//        //    var itemPostTitle = {
//        //        Title: "PostTitle_" + $scope.LanguageList[i].LANG_CODE,
//        //        Value: $scope.createform["PostTitle_" + $scope.LanguageList[i].LANG_CODE].$modelValue
//        //    };

//        //    var itemPostDesc = {
//        //        Title: "PostDescription_" + $scope.LanguageList[i].LANG_CODE,
//        //        Value: $scope.createform["PostDescription_" + $scope.LanguageList[i].LANG_CODE].$modelValue
//        //    };

//        //    var itemPostConten1 = {
//        //        Title: "PostContent_" + $scope.LanguageList[i].LANG_CODE,
//        //        Value: contentValue1
//        //    };

//        //    var itemPostConten2 = {
//        //        Title: "PostHtml_" + $scope.LanguageList[i].LANG_CODE,
//        //        Value: contentValue2
//        //    };

//        //    listPostLang.push(itemPostTitle);
//        //    listPostLang.push(itemPostDesc);
//        //    listPostLang.push(itemPostConten1);
//        //    listPostLang.push(itemPostConten2);
//        //}

//        console.log($scope.createform["PostTitle_vi"].$modelValue);
//        //console.log(CKEDITOR.instances.PostContent_vi.getData());
//        console.log(listPostLang);


//        var PostViewModel = {
//            Category: $scope.Category,
//            Widgets: $scope.Widget
//        };

//        var promisePost = VnpayService.createPost(PostViewModel);

//        promisePost.then(function (pl) {
//            $location.path('/admin/post.htm');
//        },
//        function (errorPl) {
//            $scope.error = 'failure loading Student', errorPl;
//        });
//    }

//    $scope.EditPageLoad = function () {
//        $("#btnSelectImg").click(function () {
//            var finder = new CKFinder();
//            finder.selectActionFunction = function (fileUrl) {
//                $('#ImageUrl').val(fileUrl);
//                $scope.ImageUrl = fileUrl;
//            };
//            finder.popup();
//            return false;
//        });

//        var sBanner = VnpayService.getBannerById($location.search().id);
//        sBanner.then(
//            function (pl) {
//                $scope.ObjBanner = pl.data.rspList;
//                console.log($scope.ObjBanner);
//                $scope.LangCode = $scope.ObjBanner.LANG_CODE;
//                $scope.BannerId = $scope.ObjBanner.BANNER_ID;
//                $scope.BannerTitle = $scope.ObjBanner.BANNER_TITLE;
//                $scope.BannerDescription = $scope.ObjBanner.BANNER_DESCRIPTION;
//                $scope.BannerKeyword = $scope.ObjBanner.BANNER_KEYWORD;
//                $scope.ImageUrl = $scope.ObjBanner.IMAGE_URL;
//                $scope.Link = $scope.ObjBanner.LINK;
//                $scope.Ord = $scope.ObjBanner.ORD;
//                $scope.Status = $scope.ObjBanner.STATUS;

//                var sCateBanner = VnpayService.getCateByBannerGuid($scope.ObjBanner.BANNER_GUID);
//                sCateBanner.then(
//                    function (pl) {
//                        $scope.CateBannerList = pl.data.rspList;
//                        console.log($scope.CateBannerList);
//                    },
//                    function (errorPl) {
//                        $scope.error = errorPl;
//                    });
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        var sLanguage = VnpayService.getAllLanguage();
//        sLanguage.then(
//            function (pl) {
//                $scope.LanguageList = pl.data.rspList;
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        var sCate = VnpayService.getAllCategory();
//        sCate.then(
//            function (pl) {
//                $scope.CateList = pl.data.rspList;
//            },
//            function (errorPl) {
//                $scope.error = errorPl;
//            });

//        $scope.OffLangList = [];
//        $scope.OffCateList = [];

//        $timeout(function () {
//            for (var i = 0; i < $scope.LanguageList.length; i++) {
//                if ($scope.LanguageList[i].LANG_CODE === $scope.ObjBanner.LANG_CODE) {
//                    var item = {
//                        LangCode: $scope.LanguageList[i].LANG_CODE,
//                        LangName: $scope.LanguageList[i].LANG_NAME,
//                        selected: true
//                    };
//                    $scope.OffLangList.push(item);
//                } else {
//                    var item1 = {
//                        LangCode: $scope.LanguageList[i].LANG_CODE,
//                        LangName: $scope.LanguageList[i].LANG_NAME
//                    };
//                    $scope.OffLangList.push(item1);
//                }
//            }

//            for (var j = 0; j < $scope.CateList.length; j++) {
//                var cate = Lazy($scope.CateBannerList).where({ CATE_ID: $scope.CateList[j].CATE_ID }).toArray();
//                if (cate.length > 0) {
//                    var item_21 = {
//                        CateGuid: $scope.CateList[j].CATE_GUID,
//                        CateName: $scope.CateList[j].CATE_NAME,
//                        selected: true
//                    };
//                    $scope.OffCateList.push(item_21);
//                } else {
//                    var item_22 = {
//                        CateGuid: $scope.CateList[j].CATE_GUID,
//                        CateName: $scope.CateList[j].CATE_NAME,
//                    };
//                    $scope.OffCateList.push(item_22);
//                }
//            }

//            $timeout(function () {
//                $(".search-select").select2();
//            }, 2000);

//        }, 1000);
//    }

//    $scope.editBanner = function () {
//        var BannerModel = {
//            LangCode: $scope.LangCode,
//            BannerTitle: $scope.BannerTitle,
//            BannerDescription: $scope.BannerDescription,
//            BannerKeyword: $scope.BannerKeyword,
//            ImageUrl: $scope.ImageUrl,
//            Link: $scope.Link,
//            Ord: $scope.Ord,
//            Status: $scope.Status,
//            Category: $scope.Category
//        };

//        var promisePost = VnpayService.editBanner($scope.BannerId, BannerModel);

//        promisePost.then(function (pl) {
//            $location.path('/admin/banner.htm');
//        },
//        function (errorPl) {
//            $scope.error = 'failure loading Student', errorPl;
//        });
//    };

//    $scope.SplitArr = function (input) {
//        var arr = input.split(",");
//        var rsArr = [];
//        if (arr.length > 0) {
//            for (var i = 0; i < arr.length; i++) {
//                if (arr[i] !== null && arr[i] !== "") {
//                    rsArr.push(arr[i]);
//                }
//            }
//        }
//        return rsArr;
//    }

//    //===========Paging Bootstrap=====
//    $scope.pageChanged = function () {
//        $scope.search();
//    };
//}]);