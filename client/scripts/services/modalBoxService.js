'use strict';
angular.module('concordyaApp')
        .factory('ModalBoxService', ['$uibModal', function ($uibModal) {
            function createEditing(item) {
              return {
                itemEditing: function () {
                  return item ? item : null;
                }
              };
            }

            return {
              openReorderVoucher: function (currentVoucherList) {
                return $uibModal.open({
                  templateUrl: '/views/template/reorder_voucher.html',
                  controller: 'TemplateReorderVoucherCtrl',
                  resolve: {
                    currentVoucherList: function(){
                      return currentVoucherList;
                    }
                  }
                });
              },
              openConfirmVoucher: function (postingType) {
                return $uibModal.open({
                  templateUrl: '/views/template/confirm_voucher.html',
                  controller: 'TemplateConfirmVoucherCtrl',
                  size: 'lg',
                  resolve: {
                    postingType: function (){
                      return postingType;
                    }
                  }
                });
              },
              openNewDepartment: function (item) {
                return $uibModal.open({
                  templateUrl: '/views/template/new_department.html',
                  controller: 'TemplateNewDepartmentCtrl',
                  resolve: createEditing(item)
                });
              },
              openConfirm: function (msg) {
                return $uibModal.open({
                  templateUrl: '/views/template/confirm.html',
                  controller: 'TemplateConfirmCtrl',
                  resolve: {
                    msg: function () {
                      return msg;
                    }
                  }
                });
              },
              openSwitchCompany:function(companyId,companyName,email){
                return $uibModal.open({
                  templateUrl: '/views/template/switch_company.html',
                  controller: 'TemplateSwitchCompanyCtrl',
                  resolve: {
                    companyId: function () {
                      return companyId;
                    },
                    companyName: function () {
                      return companyName;
                    },
                    email: function () {
                      return email;
                    }
                  }
                });
              },
              openNewCompany:function(){
                return $uibModal.open({
                  templateUrl: '/views/template/new_company.html',
                  controller: 'TemplateNewCompanyCtrl'
                });
              },
              openAttachmentList: function (data) {
                return $uibModal.open({
                  templateUrl: '/views/template/attachment_list.html',
                  controller: 'TemplateAttachmentListCtrl',
                  resolve: {
                    sourceList: function () {
                      return data.sourceList;
                    },
                    sourceId: function () {
                      return data.sourceId;
                    },
                    sourceType: function () {
                      return data.sourceType;
                    },
                    enable: function () {
                      return data.enable;
                    },
                    updateAttachmentCount: function() {
                      return data.updateAttachmentCount;
                    }
                  }
                });
              },
              openNewSubCategory: function (item) {
                return $uibModal.open({
                  templateUrl: '/views/template/new_sub_category.html',
                  controller: 'TemplateNewSubCategoryCtrl',
                  resolve: createEditing(item)
                });
              },
              openLevelOneCategoryList: function () {
                return $uibModal.open({
                  templateUrl: '/views/template/level_one_category_list.html',
                  controller: 'TemplateLevelOneCategoryListCtrl',
                  size: 'lg'
                });
              },
              openNewContact: function (item) {
                return $uibModal.open({
                  templateUrl: '/views/template/new_contact.html',
                  controller: 'TemplateNewContactCtrl',
                  resolve: createEditing(item)
                });
              },
              openNewInventory: function (item) {
                return $uibModal.open({
                  templateUrl: '/views/template/new_inventory.html',
                  controller: 'TemplateNewInventoryCtrl',
                  resolve: createEditing(item)
                });
              },
              openNewTaxRate: function (item) {
                return $uibModal.open({
                  templateUrl: '/views/template/new_tax_rate.html',
                  controller: 'TemplateNewTaxRateCtrl',
                  resolve: createEditing(item)
                });
              },
              openAccountInvitation: function () {
                return $uibModal.open({
                  templateUrl: '/views/template/account_invitation.html',
                  controller: 'TemplateAccountInvitationCtrl'
                });
              },
              openAccountInfo: function (id) {
                return $uibModal.open({
                  templateUrl: '/views/template/account_info.html',
                  controller: 'TemplateAccountInfoCtrl',
                  resolve: {
                    accountId: function () {
                      return id;
                    }
                  }
                });
              },
              openApproveDeny: function (ids, entityType, approvalType) {
                return $uibModal.open({
                  templateUrl: '/views/template/approve_deny.html',
                  controller: 'TemplateApproveDenyCtrl',
                  resolve: {
                    ids: function () {
                      return ids;
                    },
                    entityType: function () {
                      return entityType;
                    },
                    approvalType: function () {
                      return approvalType;
                    }
                  }
                });
              },
              openForward: function (ids, entityType, approvalType) {
                return $uibModal.open({
                  templateUrl: '/views/template/forward.html',
                  controller: 'TemplateApproveDenyCtrl',
                  resolve: {
                    ids: function () {
                      return ids;
                    },
                    entityType: function () {
                      return entityType;
                    },
                    approvalType: function () {
                      return approvalType;
                    }
                  }
                });
              },
              openApproveDenyPettyCashList: function (pettyCashIds, advancePaymentIds) {
                return $uibModal.open({
                  templateUrl: '/views/template/approve_deny.html',
                  controller: 'TemplateApproveDenyPettyCashCtrl',
                  resolve: {
                    pettyCashIds: function () {
                      return pettyCashIds;
                    },
                    advancePaymentIds: function () {
                      return advancePaymentIds;
                    }
                  }
                });
              },
              openApproveDenyVoucher: function (id) {
                return $uibModal.open({
                  templateUrl: '/views/template/approve_deny.html',
                  controller: 'TemplateApproveDenyVoucherCtrl',
                  resolve: {
                    id: function () {
                      return id;
                    }
                  }
                });
              },
              openNewCategory: function (categoryType) {
                return $uibModal.open({
                  templateUrl: '/views/template/new_category.html',
                  controller: 'TemplateNewCategoryCtrl',
                  resolve: {
                    categoryType: function () {
                      return categoryType;
                    }
                  }
                });
              },
              openRemoveCategory: function (item) {
                return $uibModal.open({
                  templateUrl: '/views/template/confirm_delete.html',
                  controller: 'TemplateConfirmDeleteCtrl',
                  resolve: {
                    msg: function () {
                      return item.name;
                    }
                  }
                });
              },
              openEditCategoryType: function (item, companyId, successFn) {
                return $uibModal.open({
                  templateUrl: '/views/template/edit_categoryType.html',
                  controller: 'TemplateEditCategoryTypeCtrl',
                  resolve: {
                    categoryType: function () {
                      return item;
                    },
                    companyId: function () {
                      return companyId;
                    },
                    successFn: function () {
                      return successFn;
                    }
                  }
                });
              },
              openAssistAccount: function (item) {
                return $uibModal.open({
                  templateUrl: '/views/template/assist_account.html',
                  controller: 'TemplateAssistAccountCtrl',
                  resolve: createEditing(item)
                });
              },
              openAddCategoryType: function (companyId, successFn) {
                return $uibModal.open({
                  templateUrl: '/views/template/edit_categoryType.html',
                  controller: 'TemplateEditCategoryTypeCtrl',
                  resolve: {
                    categoryType: function (){
                      return null;
                    },
                    companyId: function () {
                      return companyId;
                    },
                    successFn: function () {
                      return successFn;
                    }
                  }
                });
              },
              openReverseCheckoutMessage: function (number) {
                return $uibModal.open({
                  templateUrl: '/views/template/reverse_checkout_comform.html',
                  controller: 'TemplateReverseMessageCtrl',
                  resolve: {
                    number: function () {
                      return number;
                    }
                  }
                });

              },
              openToDoList: function(title, data) {
                return $uibModal.open({
                  templateUrl: '/views/template/todolist.html',
                  controller: 'TemplateToDoListCtrl',
                  resolve: {
                    title: function () {
                      return title;
                    },
                    data: function () {
                      return data;
                    }
                  }
                });
              },
              openHelpVideo: function (helpType) {
                return $uibModal.open({
                  templateUrl: '/views/template/help_video.html',
                  controller: 'TemplateHelpVideoCtrl',
                  resolve: {
                    helpType: function () {
                      return helpType;
                    }
                  }
                });
              },
              //TODO servicetype
             openNewServiceCategory:function(item){
               return $uibModal.open({
                 templateUrl:  '/views/template/service-category-new.html',
                 controller: 'TemplateNewServiceCategoryCtrl',
                 resolve:  createEditing(item)
               });
             }
            };
          }]);
