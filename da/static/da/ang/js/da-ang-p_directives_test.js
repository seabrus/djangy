
// ==========================================================
//     openingHoursDirective
// ==========================================================
describe('Opening Hours Directive', function() {
    beforeEach( module('djangy') );

    var htmlTemp =                           // input's value is not visible. Simulate it in <th> below
                '<table class="table"> \
                  <thead>\
                    <tr>\
                      <th class="day">Day</th>\
                      <th class="from-until">From </th>\
                      <th class="from-until">Until </th>\
                      <th>   {{ ctrl.regData.openingHours[1].hours[0].until }}   </th>\
                      <th> </th>\
                    </tr>\
                  </thead>\
                  <tbody>\
                    <tr ng-repeat="dayOfWeek in ctrl.regData.openingHours">\
                      <td ng-bind-html="dayOfWeek.dayName"></td>\
                      <td colspan="4">\
                        <table class="table no-bottom">\
                          <tbody>\
                            <tr ng-repeat="hrs in dayOfWeek.hours as results">\
                              <td class="no-border"><input type="text" placeholder="10-00" class="form-control yh-style"\
                                        ng-model="hrs.from" \
                                        required="" \
                                        maxlength="5"\
                                        ng-pattern="/^[0-2]{0,1}[0-9]{1}[\:\-][0-5][0-9]$/"></td>\
                              <td class="no-border"><input type="text" placeholder="14-00" class="form-control yh-style"\
                                        ng-model="hrs.until"\
                                        required="" \
                                        maxlength="5"\
                                        ng-pattern="/^[0-2]{0,1}[0-9]{1}[\:\-][0-5][0-9]$/"></td>\
                              <td class="no-border" ng-click="ctrl.deleteTimeSpan( dayOfWeek.dayName, hrs.from, hrs.until )"><img \
                                    src="/static/da/ang/img/delete.png" alt="Delete this time span" \
                                    class="whours" title="Delete this time span"></td>\
                              <td class="no-border" ng-click="ctrl.addTimeSpan( dayOfWeek.dayName, hrs.from, hrs.until )"><img \
                                    src="/static/da/ang/img/plus.png" alt="Add a new time span below" \
                                    class="whours" title="Add a new time span below"></td>\
                            </tr>\
                            <tr ng-if="results.length === 0">\
                              <td colspan="4" class="no-border td-center" \
                                    ng-click="ctrl.addTimeSpan( dayOfWeek.dayName, hrs.from, hrs.until )"><img \
                                    src="/static/da/ang/img/plus.png" alt="Add a new time span" class="whours"\
                                    title="Add a new time span"> Add a new time span</td>\
                            </tr>\
                          </tbody>\
                        </table>\
                      </td>\
                    </tr>\
                  </tbody>\
                </table>';


    var compile, mockBackend, rootScope;

    // Step 1
    beforeEach(inject(function($compile, $httpBackend, $rootScope) {
        compile = $compile;
        mockBackend = $httpBackend;
        rootScope = $rootScope;
    }));

    it('test 1: should render HTML based on scope correctly', function() {
        // Step 2
        var scope = rootScope.$new();
        scope.ctrl = {
            regData: {
                openingHours: [
                    { dayName: 'Monday', hours: [] },
                    { dayName: 'Tuesday', hours: [{ id: 21, from: '8-00', until: '10-30', db_id: 21 }] },
                    { dayName: 'Wednesday', hours: [{ id: 1, from: '9:00', until: '12:30', db_id: 1 }, { id: 2, from: '19:00', until: '23:30', db_id: 2 }] },
                    { dayName: 'Thursday', hours: [] },
                    { dayName: 'Friday', hours: [] },
                    { dayName: 'Saturday', hours: [] },
                    { dayName: 'Sunday', hours: [] },
                ]
            },
            addTimeSpan: function() {},
            deleteTimeSpan: function() {},
        };

        // Step 3
        mockBackend.expectGET('/static/da/ang/html/working-hours.html').respond( htmlTemp );

        // Step 4
        var element = compile('<div opening-hours-directive=""></div>')(scope);

        // Step 5
        scope.$digest();
        mockBackend.flush();

        // Step 6
        expect(element.html()).toMatch(/10-30/);
    });
});




