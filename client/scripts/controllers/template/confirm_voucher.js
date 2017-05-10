'use strict';

angular.module('concordyaApp')
  .controller('TemplateConfirmVoucherCtrl', ['$scope', '$translate', '$translatePartialLoader', '$state', '$stateParams', '$window', '$timeout', '$modalInstance', 'APIService', 'StorageService', 'ModalBoxService', 'UtilityService', 'WidgetService', 'postingType',
    function ($scope, $translate, $translatePartialLoader, $state, $stateParams, $window, $timeout, $modalInstance, api, storage, modalBox, utility, widget, postingType) {
      $translatePartialLoader.addPart('financial_manage/voucher');
      widget.hideMessage();

      var currentUser = storage.getCurrentUser(),
        post_state_changed = false, //current account post state before click confirm button
        originalVoucher = null;
      $scope.currentUserId = currentUser.userId;
      $scope.currentUser = currentUser;

      //create voucher
      api.accountPosting.createVoucher(postingType)
        .success(function (list) {
          var data = list[0];
          var itemList = [],
            order = 1;
          _.forEach(data.accountVoucherItems, function (item) {
            item.action = 3;
            item.order = order++;
            item.debit = item.debit ? item.debit : null;
            item.credit = item.credit ? item.credit : null;
            item.assistingCategoryList = item.accountingCategory && item.accountingCategory.bindedAssistantTypes;
            item.assistingCategory = item.accountVoucherItemRelationAssistantAccountItems;
            itemList.push(item);
          });
          data.accountVoucherItems = _.sortByOrder(itemList, 'order');
          data.companyName = data.company.name;
          data.attachmentCount = data.attachmentCount || data.attachment.length;
          originalVoucher = _.cloneDeep(data);
          $scope.voucher = data;
          getAccountVoucherItemsParentName();
          $scope.readonly = false;
          if(!data.createdOn){
            data.createdOn=data.minDate;
          };
          $scope.$safeApply();
        });

      // approve confirm
      $scope.approveConfirm = function (form) {
        if (form.$valid && validDebitCredit()) {
          var voucher = $scope.voucher;
          utility.removeErrorClass(form);
          if (voucher.total.debit == 0 || voucher.total.credit == 0) {
            widget.showModalError($translate.instant('VOUCHER.MESSAGE_TOTAL_IS_ZERO'));
            return;
          }
          if (voucher.total.debit === voucher.total.credit) {

            var   items = [];

            if (voucher.id) {
              _.forEach(voucher.accountVoucherItems, function (item) {
                if (item.action !== undefined) {
                  var assistantAccountItems = [];

                  _.forEach(item.assistingCategory, function (i) {
                    assistantAccountItems.push({
                      assistantAccountItemId: i.assistantAccountItem.id,
                      assistantAccountItemTypeId: i.assistantAccountItemType.id
                    });
                  });

                  items.push({
                    'id': item.id,
                    'summary': item.summary,
                    'accountingCategoryId': item.accountingCategory && item.accountingCategory.id,
                    'accountVoucherItemRelationAssistantAccountItems': assistantAccountItems,
                    'credit': item.credit,
                    'debit': item.debit,
                    'action': item.action,
                    'order': item.order
                  });
                }
              });

              var attachmentIds = [];
              _.forEach(voucher.attachment, function (item) {
                attachmentIds.push(item.id);
              });

              var params = {
                'id': voucher.id,
                'attachmentId': attachmentIds,
                'attachmentCount': voucher.attachmentCount,
                'description': voucher.description,
                'accountVoucherItems': items,
                'accountVoucherNumber':voucher.accountVoucherNumber,
                'confirmedOn':voucher.createdOn
              };

              api.voucher.approveConfirm(params)
                .success(function (data) {
                  widget.showModalSuccess($translate.instant('VOUCHER.MESSAGE_APPROVE_CONFIRM_SUCCESS'));
                  voucher.accountVoucherNumber = data.accountVoucherNumber;
                  $modalInstance.close(true);
                  voucher.confirmed = true;
                  post_state_changed = true;
                  $scope.$safeApply();
                });
            }
          } else {
            widget.showModalError($translate.instant('VOUCHER.MESSAGE_DEBIT_CREDIT_SHOULD_EQUAL'));
          }
        } else {
          utility.addErrorClass(form);
        }
      };

      // cancel action, reset account object
      $scope.cancel = function () {
        var refresh_state = false;
        if (post_state_changed) {
          refresh_state = true;
          $modalInstance.close(refresh_state);
        }
        $modalInstance.dismiss('cancel');
      };


      // trigger date-picker
      $scope.triggerPicker = function ($event, type) {
        $event.preventDefault();
        $event.stopPropagation();

        switch (type) {
          case 'start':
            $scope.startIsOpened = !$scope.startIsOpened;
            break;
        }
      };


      function validDebitCredit() {
        var list = $scope.voucher.accountVoucherItems,
          result = true;
        _.forEach(list, function (item) {
          if (item.isNotRowEmpty && (!item.summary || (!item.debit && !item.credit) || !item.accountingCategory || !item.assistingCategory)) {
            result = false;
          }
        });
        if (!$scope.voucher.isNotAllEmpty) {
          result = false;
        }
        return result;
      }

      // combine parent name
      function getParentName(data, item, result) {
        var parent = _.findWhere(data, {'id': item.parentId});
        if (parent && parent.name) {
          result.parentName = parent.name + result.parentName;
        }
        if (parent && parent.parentId) {
          result.parentName = ' — ' + result.parentName;
          getParentName(data, parent, result);
        }
      }

      function getAccountVoucherItemsParentName() {
        var list = $scope.accountingCategoryList,
          voucher = $scope.voucher;

        if (list && voucher) {
          _.forEach(voucher.accountVoucherItems, function (item) {
            if (item.accountingCategory && item.accountingCategory.parentId) {
              item.accountingCategory.parentName = '';
              getParentName(list, item.accountingCategory, item.accountingCategory);
            }
          });
        }
      }

      // get account-category
      api.accountCategory.getAllList()
        .success(function (data) {
          _.forEach(data, function (item) {
            if (item.parentId) {
              item.parentName = '';
              getParentName(data, item, item);
            }
          });
          $scope.accountingCategoryList = data;
          if ($stateParams && $stateParams.id) {
            getAccountVoucherItemsParentName();
          }
          $scope.$safeApply();
        });

      // get current account period
      api.company.getAccountPeriod()
        .success(function (data) {
          var accountPeriod = moment({year: data.year, month: data.month - 1}).format();
          $scope.accountPeriod = accountPeriod;

          if (!$stateParams || !$stateParams.id) {
            var date = moment(),
              timestamp = date.format(),
              year = date.year(),
              month = date.month() + 1,
              createdOn, firstDay, lastDay;

            if (data.year === year && data.month === month) {
              createdOn = timestamp;
            } else {
              if (timestamp < accountPeriod) {
                firstDay = '01';
                createdOn = moment({year: data.year, month: data.month - 1, day: firstDay}).format();
              } else {
                lastDay = new Date(data.year, data.month, 0).getDate();
                createdOn = moment({year: data.year, month: data.month - 1, day: lastDay}).format();
              }
            }
            $scope.voucher.createdOn = createdOn;
          }
        });

      $scope.changeUploadNum = function () {
        var voucher = $scope.voucher,
          attachmentCount = voucher.attachmentCount;
        if (!attachmentCount || !/^[1-9]\d*$/.test(attachmentCount)) {
          attachmentCount = voucher.attachment.length;
        }
        $scope.voucher.attachmentCount = attachmentCount;
      };

      // directly handle dom in controller is bad code, try to implement it first

      // keypress enter in summary input
      $scope.summaryKeypress = function ($event, item) {
        if ($event.keyCode === 13) {
          var diSelect = $($event.target).closest('tr').find('.di-select').eq(0);

          item.showAccount = true;

          // switch focus to di-select
          $timeout(function () {
            diSelect.addClass('open').find('.form-input').focus();
          }, 0, false);
        }
      };

      //summary click function
      $scope.summaryFocus = function ($event, $index, item) {
        var currTd = $($event.target);
        var hasValue = (currTd.val() !== "") ? true : false;

        if (hasValue) {
          // 不做修改
        } else {
          //复制上一行的摘要
          var itemList = $scope.voucher.accountVoucherItems,
            total = $scope.voucher.total,
            lastItem;
          if ($index != 0) {
            lastItem = itemList[$index - 1];
            item.summary = lastItem.summary;
          }
        }
      };
      // 借放金额 和 贷方金额获取焦点事件
      $scope.debitorcreditFocus = function ($event, $index, item) {
        var currTd = $($event.target); // 当前 tds
        var hasValue = (currTd.val() !== "") ? true : false;

        if (hasValue) {
          // 不做修改
        } else {
          var itemList = $scope.voucher.accountVoucherItems,
            total = $scope.voucher.total,
            newItem;

          if ($index + 1 < itemList.length) {
            // copy previous summary and calculate debit/credit
            newItem = itemList[$index];
            if (!newItem.summary) {
              newItem.summary = itemList[$index - 1].summary;
            }
            if (!newItem.debit && !newItem.credit) {
              // debit & credit both empty
              newItem.debit = (total.debit < total.credit) ? utility.floatNumSubtract(total.credit - total.debit) : null;
            }
            if (!newItem.credit && !newItem.debit) {
              // debit & credit both empty
              newItem.credit = (total.debit > total.credit) ? utility.floatNumSubtract(total.debit - total.credit) : null;
            }
          }
        }
      };
      // keypress enter in credit or debit input
      $scope.amountKeypress = function ($event, $index, item) {
        if ($event.keyCode === 13) {
          var currentTr = $($event.target).closest('tr'),
            itemList = $scope.voucher.accountVoucherItems,
            total = $scope.voucher.total,
            newItem;

          if ($index + 1 < itemList.length) {
            // copy previous summary and calculate debit/credit
            newItem = itemList[$index + 1];
            //如果下一行“摘要”有值， 就不copy上一行的摘要
            if (!newItem.summary) {
              newItem.summary = item.summary;
            }
            //newItem.debit = (total.debit < total.credit) ? total.credit - total.debit : null;
            //newItem.credit = (total.debit > total.credit) ? total.debit - total.credit : null;
            if (!newItem.debit && !newItem.credit) {
              // debit & credit both empty
              newItem.debit = (total.debit < total.credit) ? utility.floatNumSubtract(total.credit - total.debit) : null;
            }
            if (!newItem.credit && !newItem.debit) {
              // debit & credit both empty
              newItem.credit = (total.debit > total.credit) ? utility.floatNumSubtract(total.debit - total.credit) : null;
            }
          } else {
            $scope.newItem(item);
          }

          // switch focus to summary input in next row
          $timeout(function () {
            currentTr.next('tr').find('.input-summary').focus().select();
          }, 0, false);
        }
      };

      // change account-category
      $scope.changeAccountCategory = function (item, $index) {
        var currentTr = $('.voucher').find('tbody').find('tr').eq($index),
          subDiSelect;

        item.assistingCategoryList = item.accountingCategory && item.accountingCategory.bindedAssistantTypes;
        item.assistingCategory = [];
        item.showAccount = false;
        $scope.voucher.showAccount = true;

        if (item.assistingCategoryList.length > 0) {
          // switch focus to sub di-select
          $timeout(function () {
            subDiSelect = currentTr.find('.sub-select').find('.di-select').eq(0);
            subDiSelect.addClass('active open').find('.form-input').focus().select();
          }, 0, false);
        } else {
          if (item.credit && item.credit !== 0) {
            // switch focus to credit input
            currentTr.find('.input-credit').focus();
          } else {
            //switch focus to debit input
            currentTr.find('.input-debit').focus();
          }
        }
      };

      // assisting-category changed
      $scope.changeAssistingCategory = function (item, $index) {
        var currentTr = $('.voucher').find('tbody').find('tr').eq(item.order - 1),
          nextSubDiSelect = currentTr.find('.sub-select').find('.di-select').eq($index + 1);

        item.assistingCategory[$index].assistantAccountItemType = {
          'id': item.assistingCategoryList[$index].id,
          'name': item.assistingCategoryList[$index].name
        };

        if (nextSubDiSelect.length > 0) {
          // switch focus to next sub di-select
          $timeout(function () {
            nextSubDiSelect.addClass('active open').find('.form-input').focus().select();
          }, 0, false);
        } else {
          if (item.credit && item.credit !== 0) {
            // switch focus to credit input
            currentTr.find('.input-credit').focus();
          } else {
            //switch focus to debit input
            currentTr.find('.input-debit').focus();
          }
        }
      };

      // attachment
      $scope.attachment = function () {
        var voucher = $scope.voucher;
        if (!$scope.readonly) {
          modalBox.openAttachmentList({
            sourceList: voucher.attachment,
            sourceId: voucher.id,
            sourceType: 8,
            enable: !voucher.sterilized && !voucher.isAutomaticGeneration,
            updateAttachmentCount: function (attachmentListLength) {
              $scope.voucher.attachmentCount = parseInt(voucher.attachmentCount) + attachmentListLength;
            }
          }).result.then(function (attachmentList) {
              $scope.voucher.attachment = attachmentList;
              $scope.$safeApply();
            });
        }
      };

      //move debit value to credit or the opposite
      $scope.switchValue = function (item) {
        if (item.debit) {
          item.credit = item.debit;
          item.debit = null;
        } else {
          item.debit = item.credit;
          item.credit = null;
        }
      };

      // new item
      $scope.newItem = function (data) {
        var itemList = $scope.voucher.accountVoucherItems,
          total = $scope.voucher.total,
          index = _.findIndex(itemList, function (item) {
            return data.order === item.order;
          }),
          newList = _.slice(itemList, 0, index + 1);

        newList.push({
          'id': null,
          'order': index + 2,
          'summary': data.summary,
          'accountingCategory': null,
          'assistingCategory': null,
          'debit': (total.debit < total.credit) ? utility.floatNumSubtract(total.credit - total.debit) : null,
          'credit': (total.debit > total.credit) ? utility.floatNumSubtract(total.debit - total.credit) : null,
          'action': 0
        });

        _.forEach(_.slice(itemList, index + 1, itemList.length), function (item) {
          item.order = parseFloat(item.order) + 1;
          newList.push(item);
        });

        $scope.voucher.accountVoucherItems = newList;
      };

      // delete item
      $scope.deleteItem = function (data) {
        var list = $scope.voucher.accountVoucherItems;

        //at least 4 rows
        if (list.length <= 4 && !data.isNotRowEmpty) {
          widget.showModalError($translate.instant('VOUCHER.MESSAGE_DELETE_ITEM_ERROR'));
          return false;
        }

        if (data.action === 0) {
          _.remove(list, function (item) {
            return item.order === data.order;
          });
        } else {
          data.action = 2;
        }
        if (list.length < 4) {
          list.push({
            'order': 0,
            'id': null,
            'summary': null,
            'accountingCategory': null,
            'assistingCategory': null,
            'credit': null,
            'debit': null,
            'action': 0
          });
        }
        var i = 1;
        _.forEach(list, function (item) {
          if (item.action !== 2) {
            item.order = i++;
          } else {
            item.order = null;
          }
        });
      };

      // get cancel-watch function
      var cancelWatch = $scope.$watch('voucher.accountVoucherItems', function (newVal, oldVal) {
        if (newVal) {
          var total = {
            debit: null,
            credit: null
          };
          _.forEach(newVal, function (item, index) {
            if (item.action !== 2) {
              total.debit = utility.floatNumAdd(total.debit, item.debit);
              total.credit = utility.floatNumAdd(total.credit, item.credit);
            }
            //console.log("total debit: " + total.debit + ", total credit: " + total.credit);

            if (oldVal) {
              var oldItem = oldVal[index];
              if (oldItem) {                       // if item's action is not new and not remove
                if (item.action !== 0 && item.action !== 2) {
                  if (item.order === oldItem.order) {
                    if (item.summary !== oldItem.summary || item.accountingCategory.id !== oldItem.accountingCategory.id
                      || item.assistingCategory.length !== oldItem.assistingCategory.length
                      || item.credit !== oldItem.credit || item.debit !== oldItem.debit) {
                      item.action = 1;
                    }
                  }
                }
              }
            }
            item.isNotRowEmpty = item.summary || item.debit || item.credit || item.accountingCategory ? true : false;
            $scope.voucher.isNotAllEmpty = item.isNotRowEmpty || $scope.voucher.isNotAllEmpty;
          });
          $scope.voucher.total = total;
        }
      }, true);

      // remove watch on state-change for performance reason
      $scope.$on('$stateChangeStart', function () {
        cancelWatch();
      });

      // view business document
      $scope.viewBusinessDocument = function () {
        var voucher = $scope.voucher;
        if (voucher.sourceId) {
          switch (voucher.sourceType) {
            case 0:
              $state.go('business/bill', {id: voucher.sourceId});
              break;
            case 1:
              $state.go('business/invoice', {id: voucher.sourceId});
              break;
            case 3:
              $state.go('business/petty_cash', {id: voucher.sourceId});
              break;
            case 4:
              $state.go('business/advance_payment', {id: voucher.sourceId});
              break;
          }
        }
      };


      function checkAccountCategoryValid() {
        var result = true;

        _.forEach($scope.voucher.accountVoucherItems, function (value) {
          if (value.accountingCategory && value.accountingCategory.hasChildren) {
            result = false;
          }
        });

        return result;
      }

    }]);
