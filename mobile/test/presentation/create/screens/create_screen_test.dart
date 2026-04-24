import 'package:dabble/presentation/create/screens/create_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('CreateScreen renders correctly', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      const ProviderScope(
        child: MaterialApp(home: Scaffold(body: CreateScreen())),
      ),
    );

    // Verify that key elements are present
    expect(find.text('Select a masterpiece'), findsOneWidget);
    expect(find.text('Details'), findsOneWidget);
    expect(find.text('Pricing'), findsOneWidget);
    expect(find.text('Publish Now'), findsOneWidget);
  });
}
